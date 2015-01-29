'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'Scenario', 'Scenarios', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', '$interval', 'DialogService', 'PivotMetaService', 'ReportsService', '$q',
    function ($scope, Scenario, Scenarios, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, $interval, DialogService, PivotMetaService, ReportsService, $q) {

    // private variables
    var cnt = 0,
        spendCubeMeta = _.find($scope.scenarioElements, function(v) {
            if (v.cubeMeta.name === "TOUCHPOINT") {
                $scope.spendElementId = v.id;
                return v;
            }
        }).cubeMeta,

    // get the data for spend summary chart
    getChartData = function() {
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
    // get spend summary data through API
    getSpendSummary= function() {
        ReportsService.getSummary(48, 10).then(function(_spendSummaryData) {
            $scope.spendSummaryData = _spendSummaryData;
            ReportsService.getSummary(64, 10).then(function(_spendComparedSummaryData) {
                $scope.spendComparedSummaryData = _spendComparedSummaryData;
                transformSpendSummaryData($scope.spendSummaryData, $scope.spendComparedSummaryData);
            });
        });
    },
    // transform the spend summary data
    transformSpendSummaryData = function(_spendSummaryData, _spendComparedSummaryData) {
        var spendData = {};
        spendData.header = {};
        spendData.header.title = 'Total Spend';
        spendData.header.total = _spendSummaryData[0].Spend;
        spendData.header.incremental = _spendSummaryData[0].Spend - _spendComparedSummaryData[0].Spend;
        spendData.header.percent = spendData.header.incremental / _spendComparedSummaryData[0].Spend;
        if (spendData.header.incremental >= 0) {
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
                    spendDatumChild.incremental = v1[1] - _.pairs(_spendComparedSummaryData[i])[i1][1];
                    spendDatumChild.percent = spendDatumChild.incremental / _.pairs(_spendComparedSummaryData[i])[i1][1];
                    if (spendDatumChild.incremental >= 0) {
                        spendDatumChild.direction = "increase";
                    } else {
                        spendDatumChild.direction = "decrease";
                    }
                    spendDatumChild.chart = {};
                    spendDatumChild.chart.results = parseInt((v1[1] / spendData.header.total) * 100);
                    spendDatumChild.chart.compared = parseInt((_.pairs(_spendComparedSummaryData[i])[i1][1] / spendData.header.total) * 100);
                    spendDatum.children.push(spendDatumChild);
                });
                spendData.body.push(spendDatum);
            }
        })
        $scope.spendData = spendData;
        getChartData();
    },
    // initiate spend view, spend summary and kpi summary, get kpi cube
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
            $scope.spendDimensions = result.dimensions;

            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.view);

            $scope.isSynced = "on";

            // kpi view
            getKPICube();

            // spend summary
            getSpendSummary();

            // kpi summary
            getKPISummary();
        });
    },
    // get kpi cube
    getKPICube = function() {
        ManageScenariosService.getAnalysisElementByCubeName($scope.scenario.id, 'OUTCOME').then(function(KPICube) {
            $scope.kpiCubeMeta = KPICube.cubeMeta;
            $scope.kpiCubeId = KPICube.cubeMeta.id;
            return getKPIMeta();
        })
    },
    // get kpi meta data
    getKPIMeta = function() {
        MetaDataService.buildDimensionsTree($scope.kpiCubeId).then(function(_KPIDimensions) {
            $scope.kpiDimensions = _KPIDimensions;
            getKPIView();
        });
    },
    // get kpi view
    getKPIView = function() {
        ManageAnalysisViewsService.getViewRelatedBy($scope.spendViewId, $scope.kpiCubeId).then(function(_KPIView) {
            if (_KPIView.id === null) {
                return PivotMetaService.createEmptyView($scope.kpiDimensions, $scope.kpiCubeMeta, $scope.spendViewId).then(function(_KPINewView) {
                    $scope.kpiView = _KPINewView;
                });
            } else {
                $scope.kpiView = _KPIView
            }
            initiateKPIModel();
        });
    },
    // get kpi summary data
    getKPISummary = function() {
        ReportsService.getSummary(61, 98).then(function(_KPISummaryData) {
            $scope.kpiSummaryData = transformKPISummaryData(_KPISummaryData);
            ReportsService.getSummary(61, 191).then(function(_KPIComparedSummaryData) {
                $scope.kpiComparedSummaryData = transformKPISummaryData(_KPIComparedSummaryData);
                _.each($scope.kpiSummaryData, function(v, i) {
                    v.incremental = v.total - $scope.kpiComparedSummaryData[i].total;
                    v.percent = v.incremental / $scope.kpiComparedSummaryData[i].total;
                    if (v.incremental >= 0) {
                        v.direction = "increase";
                    } else {
                        v.direction = "decrease";
                    }
                });
            });
        });
    },
    // transform kpi summary data
    transformKPISummaryData = function(_KPISummaryData) {
        var tmpKPISummaryData = _.pairs(_KPISummaryData[0]).slice(1,6);
        var kpiSummaryData = [];
        _.each(tmpKPISummaryData, function(v,i){
            var kpiSummaryDatum = {};
            kpiSummaryDatum.id = i+1;
            kpiSummaryDatum.title=v[0];
            kpiSummaryDatum.total=v[1];
            kpiSummaryData.push(kpiSummaryDatum);
        })
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
    },
    // init function
    init = function() {
        // scope variables
        $scope.saveAs = false;
        $scope.rename = false;

        $scope.comparedViewList = angular.copy(Scenarios);
        $scope.comparedViewList.unshift(Scenario.referenceScenario);
        $scope.comparedViewList[0].title = $scope.comparedViewList[0].name;
        $scope.selectedComparedView = $scope.comparedViewList[0];

        $scope.chartData = [];

        // spend cube
        $scope.spendCubeId = spendCubeMeta.id;
        initiateSpendModel(spendCubeMeta);

        angular.element('.Scenario').css('height', 'auto');
    }, renameView = function(cubeId, view) { // rename the view
        ManageAnalysisViewsService.renameView(view.id, cubeId, view.name).then(function(response) {
            _.each($scope.spendViewsList, function(item) {
                if(item.id === response.id) {
                    item.name = response.name;
                }
            });
        });
    };

    // returns list of all the views in the current cube
    $scope.getViewsList = function() {
        return $scope.spendViewsList;
    };
    // open the modal for the list of all views
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/pivot_builder_all_views.tpl.html', 'pivotBuilderAllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // load view
    $scope.loadView = function(cubeId, viewId) {
        ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
            $scope.spendViewId = view.id;
            $scope.spendViewData = view;
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.spendMembersList = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, view);
            getKPIView();
        });
    };
    // reset the view to the last saved state
    $scope.revertView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.spendViewData.name.substring(8);
            var originalViewId = _.find($scope.spendViewsList, function(view) { return originalViewName === view.name; }).id;
            var draftViewId = $scope.spendViewData.id;

            // load view automatically deletes draft view if a non-draft is loaded
            $scope.loadView($scope.spendCubeId, originalViewId);
        }
    };
    // start save as process
    $scope.startSaveAs = function() {
        $scope.saveAsName = $scope.spendViewData.name;
        $scope.saveAs = true;
        $scope.rename = false;
    };
    // submit save as process
    $scope.submitSaveAs = function() {
        $scope.spendViewData.name = $scope.saveAsName;

        if($scope.rename) { // if submitting
            $scope.draftView = false;
            renameView($scope.spendCubeId, $scope.spendViewData);
        } else if (!$scope.rename) {
            $scope.spendViewData.id = null;
            $scope.createView($scope.spendCubeId, $scope.spendViewData, $scope.spendViewsList);
        }

        $scope.cancelSaveAs();
    };
    // cancel the save as process
    $scope.cancelSaveAs = function() {
        $scope.rename = false;
        $scope.saveAs = false;
    };
    // start the rename process
    $scope.startRename = function() {
        $scope.saveAsName = $scope.spendViewData.name;
        $scope.saveAs = true;
        $scope.rename = true;
    };
    // set compared view
    $scope.loadComparedView = function(_viewId) {
        _.find($scope.comparedViewList, function(v) {
            if(v.id === _viewId) { $scope.selectedComparedView = v };
        });
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
        return direction === 'increase' ? '+' : '-';
    };
    // add arrow to KPI summary
    $scope.addArrow = function(direction) {
        return direction === 'increase' ? 'arrow-up' : 'arrow-down';
    };
    // open/dismiss filters selection modal
    $scope.spendFiltersModal = function(category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.spendAddedFilters, viewData: $scope.spendViewData, dimensions: $scope.spendDimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.spendAddedFilters = data;
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, $scope.spendViewData);
        });
    };
    // open/dismiss filters selection modal
    $scope.kpiFiltersModal = function(category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.kpiAddedFilters, viewData: $scope.kpiViewData, dimensions: $scope.kpiDimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.kpiAddedFilters = data;
            $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
        });
    };

    // fire off init function
    init();

}]);