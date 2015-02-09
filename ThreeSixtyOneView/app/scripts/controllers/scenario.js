/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioCtrl", ["$scope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "ManageScenariosService", "DialogService", "PivotMetaService", "Calculate", "PivotService", "ManageAnalysisViewsService", "AnalyticCalculationsService", "CONFIG",
    function($scope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, ManageScenariosService, DialogService, PivotMetaService, Calculate, PivotService, ManageAnalysisViewsService, AnalyticCalculationsService, CONFIG) {

        var init = function() {
            $scope.draftView = false;
            $scope.added = {};
            $scope.addedFilters = {};
            $scope.categorizedValue = [];
            $scope.viewData = {name: 'Loading ...'};
            // $scope.viewDataExport = [];

            $scope.project = Project;
            $scope.scenario = Scenario;
            $scope.views = {
                views: [],
                currentView: {}
            };
            $scope.scenarioElements = ScenarioAnalysisElements;
            $scope.groupedScenarioElements = _.groupBy(ScenarioAnalysisElements, function(element) {return element.group});

            // either load the element selected in scenario listing page or TOUCHPOINT related element if none selected
            $scope.setScenarioElement(!!parseInt($state.params.scenarioElementId) ? getScenarioElementById($scope.scenarioElements, parseInt($state.params.scenarioElementId)) : getScenarioElementByCubeName($scope.scenarioElements, 'TOUCHPOINT'));

            // hardcoded data
            $scope.pivotTableData = '';
            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};
            $scope.getlocation();

            $scope.scenarioState = AnalyticCalculationsService.getScenarioState(Calculate.currentState);

            $scope.scenarioStates =CONFIG.application.models.ScenarioAnalytics.states;

            setView($scope.scenarioState);


        },
        initiateModel = function(cubeMeta) {
            PivotMetaService.initModel(cubeMeta).then(function(result) {
                var foundView = _.find(result.viewsList, function(view){ return view.id === result.view.id; });
                if (foundView) {
                    $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
                }
                $scope.viewsList = result.viewsList;
                $scope.views.currentView = result.view;
                $scope.viewData = result.view;
                // $scope.viewDataExport = result.view.rows.concat(result.view.columns);
                $scope.viewName = result.view.name;
                $scope.dimensions = result.dimensions;

                $scope.added = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
                $scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.view);

                $scope.loadPivotTable($scope.selectedScenarioElement, result.view);
            });
        },
        getScenarioElementById = function(data, id){
           return  _.findWhere(data, {id: id});
        },
        getScenarioElementByCubeName = function(_data, _name){
           return  _.find(_data, function(element) { return element.cubeMeta.name ===_name; });
        },
        setView = function(currentState){
            if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)){
                $timeout(function(){$state.go("Scenario.calculate");});
            }
        },
        deleteView = function(cubeId, viewId) {
            ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
                $scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
                $scope.draftView = false;
            });
        },
        createView = function(cubeId, view, viewList) {
            var i;
            $scope.viewsList = viewList;
            // remove conflicting elements from the view
            view.id = null;
            for(i = 0; i < view.filters.length; i++) {
                view.filters[i].id = null;
            }

            return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
                $scope.viewData = angular.copy(view);
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.viewsList.unshift(view);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                return view;
            });
        },
        updateView = function(cubeId, view) {
            // filter ids should be set to zero before update
            _.each(view.filters, function(filter) {
                filter.id = 0;
            });
            return ManageAnalysisViewsService.updateView(view, cubeId).then(function(response) {
                return response;
            });
        },
        replaceScenarioElement = function(newElement) {
            _.each($scope.scenarioElements, function(element, index) {
                if(element.cubeMeta.id === newElement.cubeMeta.id) {
                    $scope.scenarioElements.splice(index, 1, newElement);
                }
            });
            $scope.selectedScenarioElement = newElement;
            $scope.selectedScenarioElementsFile = newElement.name;
            $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
        },
        replaceAnalysisElementForCube = function(scenarioId, cubeId, elementId) {
            ManageScenariosService.replaceAnalysisElementForCube(scenarioId, cubeId, elementId).then(function(element) {
                replaceScenarioElement(element);
            });
        },
        copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, newElementData) {
            ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, sourceElementId, newElementData).then(function(element){
                replaceScenarioElement(element);
            });
        };

        $scope.setState = function(state){
            $scope.scenarioState = CONFIG.application.models.ScenarioAnalytics.states[state];
        };

        $scope.getlocation = function (){
            var url = $state.current.url.match(/\/\w+/)[0],
                location;

            switch(url){
                case "/edit" : location = url; break;
                default: location = "/results";
            }
            $scope.location = location;
        };

        $scope.gotoResults = function(){
            if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                $state.go("Scenario.calculate");
            } else {
                $state.go("Scenario.results");
            }
        };

        $scope.disableSimulateBtn = function() {
            if($scope.location === '/edit') {
                return ($scope.scenarioState.message === 'in_progress' || $scope.scenarioState.message === 'SUCCESSFUL') ? true : false;
            } else {
                return true;
            }
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
                        deleteView($scope.cubeId, draftId);
                    }
                }

                $scope.views.currentView = view;
                $scope.viewData = view;
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

                $scope.loadPivotTable($scope.selectedScenarioElement, view);
            });
        };

        // update filter values after any change made to them in the filters modal
        $scope.updateFilterValues = function(newFilterData) {
            $scope.addedFilters = newFilterData;

            $scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
            $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.views.currentView);
        };

        // save the draft view
        $scope.saveDraftView = function() {
            if(!$scope.draftView) {
                $scope.draftView = true;
                var draftView = angular.copy($scope.viewData);
                draftView.name = 'Draft - ' + draftView.name;
                createView($scope.cubeId, draftView, $scope.viewsList).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            } else {
                updateView($scope.cubeId, $scope.viewData).then(function() {
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
                updateView($scope.cubeId, $scope.viewData).then(function(view) {
                    $scope.viewData = view;
                    $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                });
                deleteView($scope.cubeId, draftViewId);
            }
        };

        $scope.loadPivotTable = function(element, view) {
            // if(element.cubeMeta.id !== 1) return;
            PivotService.getSlice(element.id, view.id).then(function(response) {
                var numCols = view.columns.length,
                    numRows = view.rows.length;
                $scope.pivotTableObject = response.original;
                $scope.spread.updateSheet(response.formatted, numCols, numRows);
                $scope.pivotTableData = response.formatted;
            });
        };

        $scope.getGroupedScenarioElements = function() {
            return $scope.groupedScenarioElements;
        };

        $scope.setScenarioElement = function(element) {
            $scope.$broadcast(EVENTS.selectScenarioElement, element);
            $scope.selectedScenarioElement = element;
            $scope.cubeId = element.cubeMeta.id;
            $scope.selectedScenarioElementsFile = element.name;
        };

        // hide scenario copy and replace options if part of the marleting plan
        $scope.hiddenScenarioElement = function(element) {
            return element.group === 'Marketing Plan';
        };

        $scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement, e2e) {
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_files.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
                {selectedScenarioElement: selectedScenarioElement, e2e: e2e},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementFiles'});

            dialog.result.then(function(data) {
                replaceAnalysisElementForCube(scenarioId, selectedScenarioElement.cubeMeta.id, data.id);
            });
        };

        $scope.openScenarioElementCopyModal = function(scenarioId, selectedScenarioElement) {
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
                {selectedScenarioElement: selectedScenarioElement},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementCopy'});

            dialog.result.then(function(data) {
                copyAndReplaceAnalysisElementForCube($scope.scenario.id, $scope.cubeId, selectedScenarioElement.id, data);
            });
        };

        $scope.$on('$locationChangeStart', function(){
            $scope.getlocation();
        });

        $scope.$on(EVENTS.selectScenarioElement, function(evt, element) {
            $scope.cubeId = element.cubeMeta.id;
            initiateModel(element.cubeMeta);
        });

        init();
    }]);