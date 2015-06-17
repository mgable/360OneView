 'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'ManageTemplatesService', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', 'DialogService', 'PivotMetaService', 'ReportsService', 'CONFIG', 'ScenarioStatesService', 'ScenarioService',
    function ($scope, ManageTemplatesService, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, DialogService, PivotMetaService, ReportsService, CONFIG, ScenarioStatesService, ScenarioService) {

    // private variables
    var syncedDimensions = [],

    // get scenarios list
    getScenariosList = function() {

        ScenarioService.getAll().then(function(response) {
            var allScenarios = [];
            // get all scenarios across the application
            _.each(_.pluck(response, 'data'), function(scenarios) {
                allScenarios = _.union(allScenarios, scenarios);
            });

            // filter scenarios with the current scenario tempalte id
            allScenarios = _.filter(allScenarios, function(scenario) {
                return scenario.template.id === $scope.scenario.template.id;
            });

            // filter scenarios with calculation status success
            ScenarioStatesService.getAllScenariosStates(_.pluck(allScenarios, 'id')).then(function(response) {
                var scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
                    idArray = _.pluck(_.filter(response, function(scenario) {
                    return scenario.currentState.message === scenarioStates.SUCCESS.message;
                }), 'scenarioId');
                allScenarios = _.filter(allScenarios, function(scenario) {
                    return _.indexOf(idArray, scenario.id) !== -1;
                });
            });

            // save the scenariosList
            $scope.scenariosList = allScenarios;

            _.each($scope.scenariosList, function(v) {
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

            if ($scope.scenario.isPlanOfRecord) {
                $scope.selectedScenario = _.find($scope.scenariosList, function(scenario) { return scenario.id === $scope.scenario.id; });
            } else {
                $scope.selectedScenario = _.find($scope.scenariosList, function(scenario) { return scenario.id === $scope.scenario.referenceScenario.id; });
            }

        });
    },

    // get kpi cube
    getKPICube = function() {
        ManageTemplatesService.getTemplateCubesByType($scope.scenario.template.id, 'Outcome').then(function(cubeId) {
            $scope.kpiCubeId = cubeId[0];
            ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.scenario.id, $scope.kpiCubeId).then(function(analysisElement) {
                $scope.kpiElementId = analysisElement.id;
                $scope.kpiCubeMeta = analysisElement.cubeMeta;
                return getKPIMeta();
            })
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

    // initiate spend view, get kpi cube, get spend summary and kpi summary,
    initiateSpendModel = function(cubeMeta) {
        PivotMetaService.initModel(cubeMeta).then(function(result) {
            var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
            if (foundView) {
                $scope.draftView = foundView.isDraft;
            }
            angular.extend($scope, result);
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

    // copy synced spend filters to kpi filters
    copyFilters = function(srcFilters, destFilters) {
        syncedDimensions = [];
        _.each(destFilters, function(v, k) {
            if (k !== 'VARIABLE') {
                if (_.has(destFilters, k) && _.has(srcFilters, k)) {
                    destFilters[k] = srcFilters[k];
                    syncedDimensions.push(k);
                }
            }
        })
        return syncedDimensions;
    },

    // get kpi summary data
    getKPISummary = function() {
        ReportsService.getSummary($scope.kpiElementId, $scope.kpiViewId).then(function(_KPISummaryData) {
            $scope.kpiSummaryData = transformKPISummaryData(_KPISummaryData);
            ManageTemplatesService.getTemplateCubesByType($scope.selectedScenario.template.id, 'Outcome').then(function(cube) {
                ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.selectedScenario.id, cube[0]).then(function(analysisElement) {
                    $scope.kpiComparedElementId = analysisElement.id;
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
                })
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

    // get spend summary data through API
    getSpendSummary= function() {
        ReportsService.getSummary($scope.spendElementId, $scope.spendViewId).then(function(_spendSummaryData) {
            $scope.spendSummaryData = _spendSummaryData;
            ManageTemplatesService.getTemplateCubesByType($scope.selectedScenario.template.id, 'Spend').then(function(cube) {
                ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.selectedScenario.id, cube[0]).then(function(analysisElement) {
                    $scope.spendComparedElementId = analysisElement.id;
                    ReportsService.getSummary($scope.spendComparedElementId, $scope.spendViewId).then(function(_spendComparedSummaryData) {
                        $scope.spendComparedSummaryData = _spendComparedSummaryData;
                        transformSpendSummaryData($scope.spendSummaryData, $scope.spendComparedSummaryData);
                    });
                })
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
                    spendDatum.children.push(spendDatumChild);
                });
                spendData.body.push(spendDatum);
            }
        });
        $scope.spendData = spendData;
    },

    // init function
    init = function() {
        $scope.saveAs = false;
        $scope.draftView = false;
        $scope.isSynced = true;
        $scope.isViewLoaded = false;
        $scope.toggleIcon = false;

        $scope.spendAdded = {};
        $scope.spendAddedFilters = {};
        $scope.spendCategorizedValue = [];
        $scope.spendViewData = {name: 'Loading ...'};

        getScenariosList();

        ManageTemplatesService.getTemplateCubesByType($scope.scenario.template.id, 'Spend').then(function(cubeId) {
            $scope.spendCubeId = cubeId[0];
            ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.scenario.id, $scope.spendCubeId).then(function(analysisElement) {
                $scope.spendElementId = analysisElement.id;
                $scope.spendCubeMeta = analysisElement.cubeMeta;
                initiateSpendModel(analysisElement.cubeMeta);
            })
        });
    };

    // DUPE: open the modal for the list of all spend views
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // open the modal for the list of all views
    $scope.openAllComparedScenariossModal = function() {
        var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.scenariosList, selectedViewId: $scope.selectedScenario.id, e2e: $scope.e2e, subTitle: 'Scenario'},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(replacedComparedViewId) {
            $scope.loadComparedScenarios(replacedComparedViewId);
        });
    };
    // DUPE: returns list of all the views in the current cube
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
        var oldViewId = $scope.spendViewData.id;
        $scope.isViewLoaded = false;
        $scope.spendViewData = {name: 'Loading ...'};
        ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
            if(!!oldViewId && !$scope.draftView) {
                ManageAnalysisViewsService.defaultView(cubeId, oldViewId, false);
            }
            if($scope.draftView) {
                var draftId = _.find($scope.spendViewsList, function(view) {return view.name.substring(0,8) === 'Draft - ';}).id;
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

            // get related kpi view
            getKPIView($scope.spendViewId);

            // get spend summary
            getSpendSummary();
        });
    };
    // set compared view
    $scope.loadComparedScenarios = function(scenarioId) {
        _.find($scope.scenariosList, function(scenario) {
            if(scenario.id === scenarioId) { $scope.selectedScenario = scenario; }
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
            $scope.isSynced = true;
            $scope.loadView($scope.spendCubeId, originalViewId);
        }
    };
    // create a new view
    $scope.createView = function(cubeId, view, type) {
        var relatedByView;
        view.id = null;
        type === 'spend' ? relatedByView = null : relatedByView = $scope.spendViewId;
        return ManageAnalysisViewsService.createView(view, cubeId, relatedByView).then(function(view) {
            if (type === 'spend') { $scope[type+'ViewsList'].unshift(view); }
            $scope[type+'ViewId'] = view.id
            $scope[type+'ViewData'] = angular.copy(view);
            $scope[type+'Added'] = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope[type+'AddedFilters'] = PivotMetaService.getAddedFilters(view.filters, $scope[type+'Dimensions']);
            return view;
        });
    };
    // save the changes in spend and kpi view
    $scope.saveView = function() {
        if ($scope.draftView && $scope.isViewLoaded) {
            var originalViewName = $scope.spendViewData.name.substring(8),
                originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id,
                draftViewId = $scope.spendViewData.id;

            $scope.spendViewData.name = originalViewName;
            $scope.spendViewData.id = originalViewId;
            $scope.spendViewData.isDraft = false;

            // update spend view
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(view) {
                $scope.spendViewData = view;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                // update kpi view
                ManageAnalysisViewsService.getViewRelatedBy($scope.spendViewData.id, $scope.kpiCubeId).then(function(orikpiView) {
                    _.extend($scope.kpiViewData, _.omit(orikpiView, 'filters'));
                    $scope.kpiViewData.isDraft = false;
                    PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(view) {
                        $scope.kpiViewData = view;
                        $scope.kpiAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                    });
                })
            });
            // delete spend draft View
            $scope.deleteView($scope.spendCubeId, draftViewId);
        }
    };
    // save the draft view
    $scope.saveDraftView = function() {
        if(!$scope.draftView) {
            $scope.draftView = true;
            var spendDraftView = angular.copy($scope.spendViewData);
            ManageAnalysisViewsService.defaultView($scope.spendCubeId, $scope.spendViewData.id, false);
            spendDraftView.name = 'Draft - ' + spendDraftView.name;
            spendDraftView.isDraft = true;
            $scope.createView($scope.spendCubeId, spendDraftView, 'spend').then(function(response) {
                getSpendSummary();

                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                }
                var kpiDraftView = angular.copy($scope.kpiViewData);
                kpiDraftView.name = 'Draft - ' + kpiDraftView.name;
                kpiDraftView.isDraft = true;
                $scope.createView($scope.kpiCubeId, kpiDraftView, 'kpi').then(function(response) {
                    getKPISummary($scope.spendViewId);
                });
            });
        } else {
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(response) {
                getSpendSummary();

                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                }
                PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(response) {
                    getKPISummary($scope.spendViewId);
                });
            });
        }
    };
    // open/dismiss filters selection modal
    $scope.filtersModal = function(type, category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {dimension: category, addedFilters: $scope[type+'AddedFilters'], viewData: $scope[type+'ViewData'].rows.concat($scope[type+'ViewData'].columns), dimensions: $scope[type+'Dimensions']},
            {windowSize: 'lg', windowClass: 'filters-modal'});

        dialog.result.then(function(data) {
            $scope[type+'AddedFilters'] = data;
            $scope[type+'ViewData'].filters = PivotMetaService.updateFilters($scope[type+'Dimensions'], $scope[type+'AddedFilters'], $scope[type+'MembersList'], $scope[type+'ViewData'].filters);
            $scope[type+'CategorizedValue'] = PivotMetaService.generateCategorizeValueStructure($scope[type+'AddedFilters'], $scope[type+'Dimensions'], $scope[type+'ViewData']);
            $scope.saveDraftView();
        });
    }
    // add prefix to incremental numbers
    $scope.addPrefix = function(direction, incremental, type) {
        var prefix = {increase: '', decrease: ''};
        if (type === 'sign') {
            prefix.increase = '+';
            prefix.decrease = '-';
        } else if (type === 'arrow') {
            prefix.increase = 'arrow-up';
            prefix.decrease = 'arrow-down';
        }
        if (incremental > 0 && !!direction) {
            if (direction === 'increase') {
                return prefix.increase;
            } else if (direction === 'decrease') {
                return prefix.decrease;
            } else {
                return '';
            }
        } else {
            return '';
        }
    };
    $scope.setToggleSwitch = function(_isSynced) {
        if(_isSynced) {
            $scope.isSynced = true;
            $scope.saveDraftView();
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