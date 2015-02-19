/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioCtrl", ["$scope", "$rootScope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "ManageScenariosService", "DialogService", "PivotMetaService", "Calculate", "PivotService", "ManageAnalysisViewsService", "AnalyticCalculationsService", "CONFIG",
    function($scope, $rootScope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, ManageScenariosService, DialogService, PivotMetaService, Calculate, PivotService, ManageAnalysisViewsService, AnalyticCalculationsService, CONFIG) {

        var init = function() {
            $scope.project = Project;
            $scope.scenario = Scenario;

            $scope.scenarioElements = ScenarioAnalysisElements;
            $scope.groupedScenarioElements = getGroupedScenarioElements();

            // either load the element selected in scenario listing page or TOUCHPOINT related element if none selected
            $scope.setScenarioElement(!!parseInt($state.params.scenarioElementId) ? getScenarioElementById($scope.scenarioElements, parseInt($state.params.scenarioElementId)) : getScenarioElementByCubeName($scope.scenarioElements, 'TOUCHPOINT'));

            $scope.getlocation();

            $scope.scenarioState = AnalyticCalculationsService.getScenarioState(Calculate.currentState);
            $scope.scenarioStates = CONFIG.application.models.ScenarioAnalytics.states;

            setView($scope.scenarioState);
        },
        getScenarioElementById = function(data, id){
           return  _.findWhere(data, {id: id});
        },
        getScenarioElementByCubeName = function(_data, _name){
           return  _.find(_data, function(element) { return element.cubeMeta.name === _name; });
        },
        setView = function(currentState){
            if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)){
                $timeout(function(){$state.go("Scenario.calculate");});
            }
        },
        getGroupedScenarioElements = function(){
            return  _.groupBy($scope.scenarioElements, function(element) {return element.group;});
        };

        $scope.setScenarioElement = function(element) {
            $scope.$broadcast(EVENTS.scenarioElementChange, element.cubeMeta);
            $scope.selectedScenarioElement = element;
            $scope.cubeId = element.cubeMeta.id;
            $scope.selectedScenarioElementsFile = element.name;
            $scope.groupedScenarioElements = getGroupedScenarioElements();
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

        $scope.$on('$locationChangeStart', function(){
            $scope.getlocation();
        });

        init();
    }]);