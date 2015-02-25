/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("scenarioEditorCtrl", ["$scope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "ManageScenariosService", "DialogService", "PivotMetaService", "Calculate", "PivotService", "ManageAnalysisViewsService", "AnalyticCalculationsService", "CONFIG",
    function($scope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, ManageScenariosService, DialogService, PivotMetaService, Calculate, PivotService, ManageAnalysisViewsService, AnalyticCalculationsService, CONFIG) {

        var init = function() {
            $scope.draftView = false;
            $scope.timeDisabled = false;
            $scope.added = {};
            $scope.addedFilters = {};
            $scope.categorizedValue = [];
            $scope.viewData = {name: 'Loading ...'};
            $scope.pivotTableData = '';

            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};

            initiateModel($scope.selectedScenarioElement.cubeMeta);
        },
        initiateModel = function(cubeMeta) {
            PivotMetaService.initModel(cubeMeta).then(function(result) {
                var foundView = _.find(result.viewsList, function(view){ return view.id === result.view.id; });
                if (foundView) {
                    $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
                }
                $scope.viewsList = result.viewsList;
                $scope.viewData = result.view;
                // $scope.viewDataExport = result.view.rows.concat(result.view.columns);
                $scope.viewName = result.view.name;
                $scope.dimensions = result.dimensions;

                $scope.added = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
                $scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
                $scope.determineTimeDisability($scope.added);
                $scope.addedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.view);

                $scope.loadPivotTable($scope.selectedScenarioElement, result.view);
            });
        };

        $scope.deleteView = function(cubeId, viewId) {
            ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
                $scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
                $scope.draftView = false;
            });
        };

        // save the draft view
        $scope.saveDraftView = function() {
            if(!$scope.draftView) {
                $scope.draftView = true;
                var draftView = angular.copy($scope.viewData);
                draftView.name = 'Draft - ' + draftView.name;
                $scope.createView($scope.cubeId, draftView).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            } else {
                PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            }
        };

        // save the changes in the current view
        $scope.saveView = function() {
            if($scope.draftView) {
                var originalViewName = $scope.viewData.name.substring(8);
                var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
                var draftViewId = $scope.viewData.id;

                $scope.viewData.name = originalViewName;
                $scope.viewData.id = originalViewId;
                PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function(view) {
                    $scope.viewData = view;
                    $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                    $scope.determineTimeDisability($scope.added);
                });
                $scope.deleteView($scope.cubeId, draftViewId);
            }
        };

        $scope.loadPivotTable = function(element, view) {
            if(!!$scope.spread.updateSheet) {
                PivotService.getSlice(element.id, view.id).then(function(response) {
                    var numCols = view.columns.length,
                        numRows = view.rows.length;
                    $scope.spread.updateSheet(response.formatted, numCols, numRows, response.helperObject);
                    $scope.pivotTableObject = response.original;
                    $scope.pivotTableData = response.formatted;
                    $scope.pivotTableHelper = response.helperObject;
                });
            }
        };

        // update filter values after any change made to them in the filters modal
        $scope.updateFilterValues = function(newFilterData) {
            $scope.addedFilters = newFilterData;

            $scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
            $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewData);
        };

        // load a view from the backend
        $scope.loadView = function(cubeId, viewId) {
            ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
                // remove the draft view if one exists and is not selected
                if($scope.draftView) {
                    var draftId;

                    _.each($scope.viewsList, function(listItem) {
                        if(listItem.name.substring(0, 8) === 'Draft - ') {
                            draftId = listItem.id;
                        }
                    });

                    if(viewId !== draftId) {
                        $scope.deleteView($scope.cubeId, draftId);
                    }
                }

                $scope.viewData = view;
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.determineTimeDisability($scope.added);
                $scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

                $scope.loadPivotTable($scope.selectedScenarioElement, view);
            });
        };

        $scope.createView = function(cubeId, view) {
            view.id = null;
            return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
                $scope.viewData = angular.copy(view);
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.determineTimeDisability($scope.added);
                $scope.viewsList.unshift(view);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                return view;
            });
        };

        $scope.renameView = function(cubeId, view) { // rename the view
            ManageAnalysisViewsService.renameView(view.id, cubeId, view.name).then(function(response) {
                _.each($scope.viewsList, function(item) {
                    if(item.id === response.id) {
                        item.name = response.name;
                    }
                });
            });
        };

        $scope.isViewDraft = function(draft) {
            if(typeof draft === 'undefined') {
                return $scope.draftView;
            } else {
                $scope.draftView = draft;
            }
        };

        $scope.determineTimeDisability = function(added) {
            var timeDimensionId = 0;

            _.each($scope.dimensions, function(dimension) {
                if(dimension.type === 'TimeDimension') {
                    timeDimensionId = dimension.id;
                }
            });

            $scope.timeDisabled = false;
            _.each(added, function(item, key) {
                if($scope.membersList[timeDimensionId][key] && added[key]) {
                    $scope.timeDisabled = true;
                }
            });
        };

        $scope.$on(EVENTS.scenarioElementChange, function(evt, cubeMeta) {
            initiateModel(cubeMeta);
        });

        init();
    }]);