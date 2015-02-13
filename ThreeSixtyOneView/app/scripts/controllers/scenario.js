/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioCtrl", ["$scope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "ManageScenariosService", "DialogService", "PivotMetaService", "Calculate", "PivotService", "ManageAnalysisViewsService", "AnalyticCalculationsService", "CONFIG",
    function($scope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, ManageScenariosService, DialogService, PivotMetaService, Calculate, PivotService, ManageAnalysisViewsService, AnalyticCalculationsService, CONFIG) {

        var scenarioElements = ScenarioAnalysisElements,
            init = function() {
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

            $scope.groupedScenarioElements = _.groupBy(ScenarioAnalysisElements, function(element) {return element.group;});

            // either load the element selected in scenario listing page or TOUCHPOINT related element if none selected
            $scope.setScenarioElement(!!parseInt($state.params.scenarioElementId) ? getScenarioElementById(scenarioElements, parseInt($state.params.scenarioElementId)) : getScenarioElementByCubeName(scenarioElements, 'TOUCHPOINT'));

            // hardcoded data
            $scope.pivotTableData = '';
            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};
            $scope.getlocation();

            $scope.scenarioState = AnalyticCalculationsService.getScenarioState(Calculate.currentState);
            $scope.scenarioStates = CONFIG.application.models.ScenarioAnalytics.states;

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
        };

        $scope.setScenarioElement = function(element) {
            $scope.$broadcast(EVENTS.selectScenarioElement, element);
            $scope.selectedScenarioElement = element;
            $scope.cubeId = element.cubeMeta.id;
            $scope.selectedScenarioElementsFile = element.name;
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
                return ($scope.scenarioState.message === $scope.scenarioStates.IN_PROGRESS.message || $scope.scenarioState.message === $scope.scenarioStates.SUCCESS.message) ? true : false;
            } else {
                return true;
            }
        };

        $scope.updateView = function(cubeId, view) {
            // filter ids should be set to zero before update
            _.each(view.filters, function(filter) {
                filter.id = 0;
            });
            return ManageAnalysisViewsService.updateView(view, cubeId).then(function(response) {
                return response;
            });
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

        $scope.$on('$locationChangeStart', function(){
            $scope.getlocation();
        });

        $scope.$on(EVENTS.selectScenarioElement, function(evt, element) {
            $scope.cubeId = element.cubeMeta.id;
            initiateModel(element.cubeMeta);
        });

        init();
    }]);