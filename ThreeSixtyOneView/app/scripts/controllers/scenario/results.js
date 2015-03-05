 'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'Scenario', 'Scenarios', 'ScenarioAnalysisElements', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', 'DialogService', 'PivotMetaService', 'ReportsService', function ($scope, Scenario, Scenarios, ScenarioAnalysisElements, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, DialogService, PivotMetaService, ReportsService) {

    // private variables
    var cnt = 0,
        spendCubeMeta = _.find(ScenarioAnalysisElements, function(v) {
            if (v.cubeMeta.name === "TOUCHPOINT") {
                $scope.spendElementId = v.id;
                return v;
            }
        }).cubeMeta,
        syncedDimensions = [],

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
            $scope.kpiDimensions = _KPIDimensions;
            getKPIView($scope.spendViewId);
        });
    },
    // get kpi view
    getKPIView = function(_spendViewId) {
        ManageAnalysisViewsService.getViewRelatedBy(_spendViewId, $scope.kpiCubeId).then(function(_KPIView) {
            if (_KPIView.id === null) {
                return PivotMetaService.createEmptyView($scope.kpiDimensions, $scope.kpiCubeMeta, _spendViewId).then(function(_KPINewView) {
                    $scope.kpiView = _KPINewView;
                    initiateKPIModel();
                });
            } else {
                $scope.kpiView = _KPIView;
                initiateKPIModel();
            }
        });
    },
    // get kpi summary data
    getKPISummary = function() {
        ReportsService.getSummary($scope.kpiElementId, $scope.kpiViewId).then(function(_KPISummaryData) {
            $scope.kpiSummaryData = transformKPISummaryData(_KPISummaryData);
            ManageScenariosService.getAnalysisElementByCubeName($scope.selectedView.id, 'OUTCOME').then(function(_kpiComparedElementCube) {
                $scope.kpiComparedElementId = _kpiComparedElementCube.id;
                ReportsService.getSummary($scope.kpiComparedElementId, $scope.kpiViewId).then(function(_KPIComparedSummaryData) {
                    $scope.kpiComparedSummaryData = transformKPISummaryData(_KPIComparedSummaryData);
                    _.each($scope.kpiSummaryData, function(v, i) {
                        var tmpkpiIncremental = v.total - $scope.kpiComparedSummaryData[i].total
                        v.incremental = Math.abs(v.total - $scope.kpiComparedSummaryData[i].total);
                        if(v.incremental < 1) {
                           v.incremental = 0;
                        }
                        v.percent = $scope.kpiComparedSummaryData[i].total !== 0 ? v.incremental / $scope.kpiComparedSummaryData[i].total : 0;
                        if (v.incremental !== 0) {
                            if (tmpkpiIncremental >= 0) {
                                v.direction = "increase";
                            } else {
                                v.direction = "decrease";
                            }
                        } else {
                            v.direction = "increase";
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
            kpiSummaryDatum.total=v[1].value;
            kpiSummaryDatum.currency=v[1].currency;
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
        if ($scope.isSynced) {
            copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
        }
        $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiView);

        $scope.isViewLoaded = true;

        getKPISummary();
    },
    // get spend summary data through API
    getSpendSummary= function() {
        ReportsService.getSummary($scope.spendElementId, $scope.spendViewId).then(function(_spendSummaryData) {
            $scope.spendSummaryData = _spendSummaryData;
            ManageScenariosService.getAnalysisElementByCubeName($scope.selectedView.id, 'TOUCHPOINT').then(function(_spendComparedElementCube) {
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
        spendData.header.total = _.values(_spendSummaryData[0])[0].value;
        spendData.header.currency = _.values(_spendSummaryData[0])[0].currency;
        var tmpSpendHeaderIncremental = _.values(_spendSummaryData[0])[0].value - _.values(_spendComparedSummaryData[0])[0].value;
        spendData.header.incremental = Math.abs(tmpSpendHeaderIncremental);
        if(spendData.header.incremental < 1) {
           spendData.header.incremental = 0;
        }
        spendData.header.percent = _.values(_spendComparedSummaryData[0])[0].value !== 0 ? spendData.header.incremental / _.values(_spendComparedSummaryData[0])[0].value : 0;
        if (spendData.header.incremental !== 0) {
            if (tmpSpendHeaderIncremental >= 0) {
                spendData.header.direction = "increase";
            } else {
                spendData.header.direction = "decrease";
            }
        } else {
            spendData.header.direction = "increase";
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
                spendDatumChild.currency = '';
                spendDatumChild.incremental = '';
                spendDatumChild.percent = '';
                spendDatumChild.direction = '';
                spendDatum.children.push(spendDatumChild);
                _.each(_.pairs(v), function(v1, i1){
                    spendDatumChild = {};
                    spendDatumChild.id = i1+1;
                    spendDatumChild.title = v1[0];
                    spendDatumChild.total = v1[1].value;
                    spendDatumChild.currency = v1[1].currency;
                    var tmpSpendDatumChildIncremental = v1[1].value - _.pairs(_spendComparedSummaryData[i])[i1][1].value;
                    spendDatumChild.incremental = Math.abs(tmpSpendDatumChildIncremental);
                    if(Math.abs(spendDatumChild.incremental) < 1) {
                       spendDatumChild.incremental = 0;
                    }
                    spendDatumChild.percent = _.pairs(_spendComparedSummaryData[i])[i1][1].value !== 0 ? spendDatumChild.incremental / _.pairs(_spendComparedSummaryData[i])[i1][1].value : 0;
                    if (spendDatumChild.incremental !== 0) {
                        if (tmpSpendDatumChildIncremental >= 0) {
                            spendDatumChild.direction = "increase";
                        } else {
                            spendDatumChild.direction = "decrease";
                        }
                    } else {
                        spendDatumChild.direction = "increase";
                    }
                    spendDatumChild.chart = {};
                    spendDatumChild.chart.results = _.values(_spendSummaryData[0])[0].value !== 0 ? parseFloat((v1[1].value / _.values(_spendSummaryData[0])[0].value) * 100).toFixed(1) : 0;
                    spendDatumChild.chart.compared = _.values(_spendComparedSummaryData[0])[0].value !== 0 ? parseFloat((_.pairs(_spendComparedSummaryData[i])[i1][1].value / _.values(_spendComparedSummaryData[0])[0].value) * 100).toFixed(1) : 0;
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
            var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
            if (foundView) {
                $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
            }
            $scope.spendViewId = result.viewData.id;
            $scope.spendViewsList = result.viewsList;
            $scope.spendViewData = result.viewData;
            $scope.spendViewName = result.viewData.name;
            $scope.spendDimensions = result.dimensions;

            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.viewData.columns.concat(result.viewData.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.viewData.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.viewData);

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
    copyFilters = function(srcFilters, destFilters) {
        syncedDimensions = [];
        for (var key in destFilters) {
            if(key !== 'VARIABLE') {
                if(destFilters.hasOwnProperty(key) && srcFilters.hasOwnProperty(key)) {
                    destFilters[key] = srcFilters[key];
                }
                syncedDimensions.push(key);
            }
        }
    },
    // init function
    init = function() {
        // view scope variables
        $scope.saveAs = false;
        $scope.isSynced = true;
        $scope.isViewLoaded = false;

        // spend view scope variables
        $scope.spendAdded = {};
        $scope.spendAddedFilters = {};
        $scope.spendCategorizedValue = [];
        $scope.spendViewData = {name: 'Loading ...'};

        // compared analysis element scope variables
        $scope.viewsList = angular.copy(Scenarios);
        if(_.has(Scenario, 'referenceScenario')) {
            $scope.viewsList.unshift(Scenario.referenceScenario);
            _.each($scope.viewsList, function(v) {
                if(!_.has(v, 'title')) {
                    v.title = v.name;
                } else {
                    v.name = v.title;
                }
                if(_.has(v, 'createdBy') && _.has(v, 'createdOn')) {
                    v.auditInfo = {};
                    v.auditInfo.createdBy = {};
                    v.auditInfo.createdOn = v.createdOn;
                    v.auditInfo.createdBy.name = v.createdBy;
                }
            });
        }
        $scope.selectedView = $scope.viewsList[0];

        // spend chart scope variables
        $scope.chartData = [];

        // spend cube scope varaibles
        $scope.spendCubeId = spendCubeMeta.id;
        initiateSpendModel(spendCubeMeta);
    };

    // // open the modal for the list of all spend views
    // DUPE
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/all_views.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // open the modal for the list of all views
    $scope.openAllComparedViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/all_views.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.viewsList, selectedViewId: $scope.selectedView.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(replacedComparedViewId) {
            $scope.loadComparedView(replacedComparedViewId);
        });
    };
    // returns list of all the views in the current cube
    // DUPE
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

            $scope.spendViewId = view.id;
            $scope.spendViewData = view;
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, view);
            getKPIView($scope.spendViewId);

            // get spend summary
            getSpendSummary();
        });
    };
    // set compared view
    $scope.loadComparedView = function(_viewId) {
        _.find($scope.viewsList, function(_view) {
            if(_view.id === _viewId) { $scope.selectedView = _view; }
        });
        // get spend summary
        getSpendSummary();
        // get kpi summary
        getKPISummary();
    };
    // reset the view to the last saved state
    //DUPE
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
        if($scope.draftView && $scope.isViewLoaded) {
            var originalViewName = $scope.spendViewData.name.substring(8);
            var originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id;
            var draftViewId = $scope.spendViewData.id;

            $scope.spendViewData.name = originalViewName;
            $scope.spendViewData.id = originalViewId;

            // update spend view
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(view) {
                console.log('save spend view: ', view);
                $scope.spendViewData = view;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                // update kpi view
                ManageAnalysisViewsService.getViewRelatedBy($scope.spendViewData.id, $scope.kpiCubeId).then(function(_KPIView) {
                    $scope.kpiView = _KPIView;
                    PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiView).then(function(view) {
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
                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                    $scope.saveKPIDraftView();
                    getKPISummary($scope.spendViewId);
                }
            });
        } else {
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(response) {
                console.log('update spend view: ', response);
                // spend summary
                $scope.spendViewId = response.id;
                $scope.spendViewData = response;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(response.columns.concat(response.rows));
                $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
                $scope.spendAddedFilters = PivotMetaService.getAddedFilters(response.filters, $scope.spendDimensions);
                $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, response);
                getSpendSummary();
                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                    $scope.saveKPIDraftView();
                    getKPISummary($scope.spendViewId);
                }
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
                PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function() {
                    getKPIView($scope.spendViewId);
                });
            });
        } else {
            PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(response) {
                console.log('update kpi view: ', response);
                getKPISummary($scope.spendViewId);
            });
        }
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
            {dimension: category, addedFilters: $scope.spendAddedFilters, viewData: $scope.spendViewData.rows.concat($scope.spendViewData.columns), dimensions: $scope.spendDimensions},
            {windowSize: 'lg', windowClass: 'filters-modal'});

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
            {dimension: category, addedFilters: $scope.kpiAddedFilters, viewData: $scope.kpiViewData, dimensions: $scope.kpiDimensions},
            {windowSize: 'lg', windowClass: 'filters-modal'});

        dialog.result.then(function(data) {
            $scope.kpiAddedFilters = data;
            $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
            $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
            $scope.saveKPIDraftView();
        });
    };
    $scope.setToggleSwitch = function(_isSynced) {
        if(_isSynced) {
            $scope.isSynced = true;
            copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
            $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
            $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
            $scope.saveKPIDraftView();
            getKPISummary($scope.spendViewId);
        } else {
            $scope.isSynced = false;
        }
    };
    $scope.isInSyncedDimensions = function(cat) {
        if(_.indexOf(syncedDimensions, cat.label) !== -1) {
            return true;
        } else {
            return false;
        }
    };

    // fire off init function
    init();

}]);