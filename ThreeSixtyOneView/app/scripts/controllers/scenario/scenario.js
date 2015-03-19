/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioCtrl", ["$scope", "$rootScope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "Calculate", "AnalyticCalculationsService", "CONFIG", "ScenarioStatesService",
	function($scope, $rootScope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, Calculate, AnalyticCalculationsService, CONFIG, ScenarioStatesService) {

		var init = function() {
			$scope.project = Project;
			$scope.scenario = Scenario;
			$scope.simulateButtonDisabled = false;

			$scope.pivotTableSaveStatus = '';

			$scope.scenarioElements = ScenarioAnalysisElements;
			$scope.groupedScenarioElements = getGroupedScenarioElements();

			// either load the element selected in scenario listing page or TOUCHPOINT related element if none selected
			$scope.setScenarioElement(!!parseInt($state.params.scenarioElementId) ? getScenarioElementById($scope.scenarioElements, parseInt($state.params.scenarioElementId)) : getScenarioElementByCubeName($scope.scenarioElements, 'TOUCHPOINT'), true);

			$scope.getlocation();
			$scope.scenarioState = ScenarioStatesService.getScenarioState(Calculate.currentState);
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

		$scope.setScenarioElement = function(element, cubeChanged) {
			if(cubeChanged) {
				$rootScope.$broadcast(EVENTS.scenarioElementChange, element.cubeMeta);
				$rootScope.$broadcast(EVENTS.pivotViewChange, {});
				
				$scope.cubeId = element.cubeMeta.id;
				$scope.groupedScenarioElements = getGroupedScenarioElements();
			}
			$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loading);

			$scope.selectedScenarioElement = element;
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

		$scope.disableSimulateButton = function(state) {
			if(!_.isUndefined(state)) {
				$scope.simulateButtonDisabled = state;
			}
			return $scope.simulateButtonDisabled;
		};

		$scope.$on(EVENTS.pivotTableStatusChange, function(event, data) {
			$scope.pivotTableSaveStatus = data.status;
		});

		$scope.$on('$locationChangeStart', function(){
			$scope.getlocation();
		});

		init();
	}]);