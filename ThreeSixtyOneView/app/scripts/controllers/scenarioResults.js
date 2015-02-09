'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'Scenario', 'Scenarios', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', 'DialogService', 'PivotMetaService', 'ReportsService',
    function ($scope, Scenario, Scenarios, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, DialogService, PivotMetaService, ReportsService) {

    // private variables
    var cnt = 0,
        spendCubeMeta = _.find($scope.scenarioElements, function(v) {
            if (v.cubeMeta.name === "TOUCHPOINT") {
                $scope.spendElementId = v.id;
                return v;
            }
        }).cubeMeta,

    // get kpi cube
    getKPICube = function() {
        ManageScenariosService.getAnalysisElementByCubeName($scope.scenario.id, 'OUTCOME').then(function(KPICube) {
            $scope.kpiElementId = KPICube.id;
            $scope.kpiCubeMeta = KPICube.cubeMeta;
            $scope.kpiCubeId = KPICube.cubeMeta.id;
            return getKPIMeta();
        });
    },
    // get kpi meta data
    getKPIMeta = function() {
        MetaDataService.buildDimensionsTree($scope.kpiCubeId).then(function(_KPIDimensions) {
            $scope.kpiDimensions = _.reject(_KPIDimensions, function(value){ return value.label === 'VARIABLE'; });
            getKPIView($scope.spendViewId);
        });
    },
    // get kpi view
    getKPIView = function(_spendViewId) {
        ManageAnalysisViewsService.getViewRelatedBy(_spendViewId, $scope.kpiCubeId).then(function(_KPIView) {
            _KPIView.filters = _.reject(_KPIView.filters, function(value){ return value.scope.dimension.label === 'VARIABLE'; });
            if (_KPIView.id === null) {
                return PivotMetaService.createEmptyView($scope.kpiDimensions, $scope.kpiCubeMeta, _spendViewId).then(function(_KPINewView) {
                    $scope.kpiView = _KPINewView;
                });
            } else {
                $scope.kpiView = _KPIView;
            }
            initiateKPIModel();
        });
    },
    // get kpi summary data
    getKPISummary = function() {
        ReportsService.getSummary($scope.kpiElementId, $scope.kpiViewId).then(function(_KPISummaryData) {
            $scope.kpiSummaryData = transformKPISummaryData(_KPISummaryData);
            ManageScenariosService.getAnalysisElementByCubeName($scope.selectedComparedView.id, 'OUTCOME').then(function(_kpiComparedElementCube) {
                $scope.kpiComparedElementId = _kpiComparedElementCube.id;
                ReportsService.getSummary($scope.kpiComparedElementId, $scope.kpiViewId).then(function(_KPIComparedSummaryData) {
                    $scope.kpiComparedSummaryData = transformKPISummaryData(_KPIComparedSummaryData);
                    _.each($scope.kpiSummaryData, function(v, i) {
                        v.incremental = Math.abs(v.total - $scope.kpiComparedSummaryData[i].total);
                        v.percent = v.incremental / $scope.kpiComparedSummaryData[i].total;
                        if (v.incremental >= 0) {
                            v.direction = "increase";
                        } else {
                            v.direction = "decrease";
                        }
                    });
                });
            });
        });
    },
    // transform kpi summary data
    transformKPISummaryData = function(_KPISummaryData) {
        var tmpKPISummaryData = _.pairs(_KPISummaryData[0]).slice(0,5);
        var kpiSummaryData = [];
        _.each(tmpKPISummaryData, function(v,i){
            var kpiSummaryDatum = {};
            kpiSummaryDatum.id = i+1;
            kpiSummaryDatum.title=v[0];
            kpiSummaryDatum.total=v[1];
            kpiSummaryData.push(kpiSummaryDatum);
        });
        return kpiSummaryData;
    },
    // initalte the kpi view
    initiateKPIModel = function() {
        $scope.kpiViewId = $scope.kpiView.id;
        $scope.kpiViewData = $scope.kpiView;
        $scope.kpiViewName = $scope.kpiView.name;

        $scope.kpiAdded = PivotMetaService.setUpAddedLevels($scope.kpiView.columns.concat($scope.kpiView.rows));
        $scope.kpiMembersList = PivotMetaService.generateMembersList($scope.kpiDimensions);
        $scope.kpiAddedFilters = PivotMetaService.getAddedFilters($scope.kpiView.filters, $scope.kpiDimensions);
        $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiView);

        getKPISummary();
    },
    // get spend summary data through API
    getSpendSummary= function() {
        ReportsService.getSummary($scope.spendElementId, $scope.spendViewId).then(function(_spendSummaryData) {
            $scope.spendSummaryData = _spendSummaryData;
            ManageScenariosService.getAnalysisElementByCubeName($scope.selectedComparedView.id, 'TOUCHPOINT').then(function(_spendComparedElementCube) {
                $scope.spendComparedElementId = _spendComparedElementCube.id;
                ReportsService.getSummary($scope.spendComparedElementId, $scope.spendViewId).then(function(_spendComparedSummaryData) {
                    $scope.spendComparedSummaryData = _spendComparedSummaryData;
                    transformSpendSummaryData($scope.spendSummaryData, $scope.spendComparedSummaryData);
                });
            });
        });
    },
    // transform spend summary data
    transformSpendSummaryData = function(_spendSummaryData, _spendComparedSummaryData) {
        var spendData = {};
        spendData.header = {};
        spendData.header.title = 'Total Spend';
        spendData.header.total = _spendSummaryData[0].Spend;
        spendData.header.incremental = Math.abs(_spendSummaryData[0].Spend - _spendComparedSummaryData[0].Spend);
        spendData.header.percent = spendData.header.incremental / _spendComparedSummaryData[0].Spend;
        if (_spendSummaryData[0].Spend - _spendComparedSummaryData[0].Spend >= 0) {
            spendData.header.direction = "increase";
        } else {
            spendData.header.direction = "decrease";
        }

        spendData.body = [];
        _.each(_spendSummaryData, function(v,i) {
            if(i > 0) {
                var spendDatum = {};
                spendDatum.id = i-1;
                spendDatum.children = [];
                var spendDatumChild = {};
                spendDatumChild.id = 0;
                spendDatumChild.title = '';
                spendDatumChild.total = '';
                spendDatumChild.incremental = '';
                spendDatumChild.percent = '';
                spendDatumChild.direction = '';
                spendDatum.children.push(spendDatumChild);
                _.each(_.pairs(v), function(v1, i1){
                    spendDatumChild = {};
                    spendDatumChild.id = i1+1;
                    spendDatumChild.title = v1[0];
                    spendDatumChild.total = v1[1];
                    spendDatumChild.incremental = Math.abs(v1[1] - _.pairs(_spendComparedSummaryData[i])[i1][1]);
                    spendDatumChild.percent = spendDatumChild.incremental / _.pairs(_spendComparedSummaryData[i])[i1][1];
                    if (v1[1] - _.pairs(_spendComparedSummaryData[i])[i1][1] >= 0) {
                        spendDatumChild.direction = "increase";
                    } else {
                        spendDatumChild.direction = "decrease";
                    }
                    spendDatumChild.chart = {};
                    spendDatumChild.chart.results = parseFloat((v1[1] / _spendSummaryData[0].Spend) * 100).toFixed(1);
                    spendDatumChild.chart.compared = parseFloat((_.pairs(_spendComparedSummaryData[i])[i1][1] / _spendComparedSummaryData[0].Spend) * 100).toFixed(1);
                    spendDatum.children.push(spendDatumChild);
                });
                spendData.body.push(spendDatum);
            }
        });
        $scope.spendData = spendData;
        getChartData();
    },
    // initiate spend view, get kpi cube, get spend summary and kpi summary,
    initiateSpendModel = function(cubeMeta) {
        PivotMetaService.initModel(cubeMeta).then(function(result) {
            var foundView = _.find(result.viewsList, function(view){ return view.id === result.view.id; });
            if (foundView) {
                $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
            }
            $scope.spendViewId = result.view.id;
            $scope.spendViewsList = result.viewsList;
            $scope.spendViewData = result.view;
            $scope.spendViewName = result.view.name;
            $scope.spendDimensions = _.reject(result.dimensions, function(value){ return value.label === 'VARIABLE'; });

            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.view);

            // spend summary
            getSpendSummary();

            // kpi cube
            getKPICube();
        });
    },
    // get the data for spend summary chart
    getChartData = function() {
        $scope.chartData = [];
        _.each($scope.spendData.body, function(v) {
            var chartSubData = {};
            chartSubData.id = v.id;
            chartSubData.name = v.category;
            chartSubData.data = [];
            _.each(v.children, function(v1) {
                if (_.has(v1, 'chart')) {
                    v1.chart.categoryId = v.id;
                    v1.chart.id = v1.id;
                    v1.chart.colorId = ++cnt;
                    v1.chart.category = v1.title;
                    chartSubData.data.push(v1.chart);
                }
            });
            $scope.chartData.push(chartSubData);
        });
    },
    // init function
    init = function() {
        // view scope variables
        $scope.saveAs = false;
        $scope.rename = false;
        $scope.isSynced = "on";

        // spend view scope variables
        $scope.spendAdded = {};
        $scope.spendAddedFilters = {};
        $scope.spendCategorizedValue = [];
        $scope.spendViewData = {};

        // compared analysis element scope variables
        $scope.comparedViewList = angular.copy(Scenarios);
        if(_.has(Scenario, 'referenceScenario')) {
            $scope.comparedViewList.unshift(Scenario.referenceScenario);
            $scope.comparedViewList[0].title = $scope.comparedViewList[0].name;
        }
        $scope.selectedComparedView = $scope.comparedViewList[0];

        // spend chart scope variables
        $scope.chartData = [];

        // spend cube scope varaibles
        $scope.spendCubeId = spendCubeMeta.id;
        initiateSpendModel(spendCubeMeta);

        // set height for results page
        angular.element('.Scenario').css('height', 'auto');
    };

    // open the modal for the list of all spend views
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/pivot_builder_all_views.tpl.html', 'pivotBuilderAllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // returns list of all the views in the current cube
    $scope.getViewsList = function() {
        return $scope.spendViewsList;
    };
    // delete a view
    $scope.deleteView = function(cubeId, viewId) {
        ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
            $scope.spendViewsList = _.reject($scope.spendViewsList, function(view) { return view.id === viewId; });
            $scope.draftView = false;
        });
    };
    // load spend view and render kpi view
    $scope.loadView = function(cubeId, viewId) {
        ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
            if($scope.draftView) {
                var draftId;
                _.each($scope.spendViewsList, function(listItem) {
                    if(listItem.name.substring(0, 8) === 'Draft - ') {
                        draftId = listItem.id;
                    }
                });
                if(viewId !== draftId) {
                    $scope.deleteView($scope.spendCubeId, draftId);
                }
            }

            view.filters = _.reject(view.filters, function(value){ return value.scope.dimension.label === 'VARIABLE'; });
            $scope.spendViewId = view.id;
            $scope.spendViewData = view;
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, view);
            getKPIView($scope.spendViewId);

            // get spend summary
            getSpendSummary()
        });
    };
    // reset the view to the last saved state
    $scope.revertView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.spendViewData.name.substring(8);
            var originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id;

            // load view automatically deletes draft view if a non-draft is loaded
            $scope.loadView($scope.spendCubeId, originalViewId);
        }
    };
    // create a new view
    $scope.createView = function(cubeId, view, viewList) {
        var i;
        $scope.spendViewsList = viewList;
        // remove conflicting elements from the view
        view.id = null;
        for(i = 0; i < view.filters.length; i++) {
            view.filters[i].id = null;
        }

        return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
            $scope.spendViewData = angular.copy(view);
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.spendViewsList.unshift(view);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            return view;
        });
    };
    // save the changes in spend and kpi view
    $scope.saveView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.spendViewData.name.substring(8);
            var originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id;
            var draftViewId = $scope.spendViewData.id;

            $scope.spendViewData.name = originalViewName;
            $scope.spendViewData.id = originalViewId;

            // update spend view
            $scope.updateView($scope.spendCubeId, $scope.spendViewData).then(function(view) {
                console.log('save spend view: ', view);
                $scope.spendViewData = view;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                // update kpi view
                ManageAnalysisViewsService.getViewRelatedBy($scope.spendViewData.id, $scope.kpiCubeId).then(function(_KPIView) {
                    $scope.kpiView = _KPIView;
                    $scope.updateView($scope.kpiCubeId, $scope.kpiView).then(function(view) {
                        console.log('save kpi view: ', view);
                        $scope.kpiViewData = view;
                        $scope.kpiAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                    });
                });
            });
            // delete spend draft View
            $scope.deleteView($scope.spendCubeId, draftViewId);
            console.log('delete draft view');
        }
    };
    // save the draft view
    $scope.saveSpendDraftView = function() {
        if(!$scope.draftView) {
            $scope.draftView = true;
            var spendDraftView = angular.copy($scope.spendViewData);
            spendDraftView.name = 'Draft - ' + spendDraftView.name;
            $scope.createView($scope.spendCubeId, spendDraftView, $scope.spendViewsList).then(function(response) {
                console.log('create spend view: ', response);
                // spend summary
                $scope.spendViewId = response.id;
                $scope.spendViewData = response;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(response.columns.concat(response.rows));
                $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
                $scope.spendAddedFilters = PivotMetaService.getAddedFilters(response.filters, $scope.spendDimensions);
                $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, response);
                getSpendSummary();
            });
        } else {
            $scope.updateView($scope.spendCubeId, $scope.spendViewData).then(function(response) {
                console.log('update spend view: ', response);
                // spend summary
                $scope.spendViewId = response.id;
                $scope.spendViewData = response;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(response.columns.concat(response.rows));
                $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
                $scope.spendAddedFilters = PivotMetaService.getAddedFilters(response.filters, $scope.spendDimensions);
                $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, response);
                getSpendSummary();
            });
        }
    };
    // save the draft view
    $scope.saveKPIDraftView = function() {
        if(!$scope.draftView) {
            $scope.draftView = true;
            var spendDraftView = angular.copy($scope.spendViewData);
            spendDraftView.name = 'Draft - ' + spendDraftView.name;
            var kpiDraftView = angular.copy($scope.kpiViewData);
            kpiDraftView.name = 'Draft - ' + kpiDraftView.name;
            $scope.createView($scope.spendCubeId, spendDraftView, $scope.spendViewsList).then(function(response) {
                console.log('create kpi view: ', response);
                $scope.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(response) {
                    getKPIView($scope.spendViewId);
                });
            });
        } else {
            $scope.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(response) {
                console.log('update kpi view: ', response);
                getKPISummary($scope.spendViewId);
            });
        }
    };
    // set compared view
    $scope.loadComparedView = function(_viewId) {
        _.find($scope.comparedViewList, function(_view) {
            if(_view.id === _viewId) { $scope.selectedComparedView = _view; }
        });
        // get spend summary
        getSpendSummary();
        // get kpi summary
        getKPISummary();
    };
    // open the modal for the list of all views
    $scope.openAllComparedViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/compared_all_views.tpl.html', 'comparedAllViewsCtrl',
            {viewsList: $scope.comparedViewList, selectedViewId: $scope.selectedComparedView.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

        dialog.result.then(function(_replacedComparedViewId) {
            $scope.loadComparedView(_replacedComparedViewId);
        });
    };
    // add sign to KPI summary
    $scope.addSign = function(direction) {
        if (direction === 'increase') {
            return '+';
        } else if (direction === 'decrease') {
            return '-';
        } else {
            return '';
        }
    };
    // add arrow icon to KPI summary
    $scope.addArrow = function(direction) {
        return direction === 'increase' ? 'arrow-up' : 'arrow-down';
    };
    // open/dismiss filters selection modal
    $scope.spendFiltersModal = function(category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.spendAddedFilters, viewData: $scope.spendViewData.rows.concat($scope.spendViewData.columns), dimensions: $scope.spendDimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.spendAddedFilters = data;
            $scope.spendViewData.filters = PivotMetaService.updateFilters($scope.spendDimensions, $scope.spendAddedFilters, $scope.spendMembersList, $scope.spendViewData.filters);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, $scope.spendViewData);
            $scope.saveSpendDraftView();
        });
    };
    // open/dismiss filters selection modal
    $scope.kpiFiltersModal = function(category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.kpiAddedFilters, viewData: $scope.kpiViewData, dimensions: $scope.kpiDimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.kpiAddedFilters = data;
            $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
            $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
            $scope.saveKPIDraftView();
        });
    };

    // fire off init function
    init();

}]);