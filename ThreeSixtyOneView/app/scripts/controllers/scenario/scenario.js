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

			// plan of record should be read-only
			if($scope.scenario.isPlanOfRecord) {
				$scope.readOnlyMode = true;
			} else {
				$scope.readOnlyMode = false;
			}

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
			return _.findWhere(data, {id: id});
		},
		getScenarioElementByCubeName = function(_data, _name){
			if(_data.length === 1) {
				return _data[0];
			} else {
				return _.find(_data, function(element) { return element.cubeMeta.name === _name; });
			}
		},
		setView = function(currentState){
			if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)){
				$timeout(function(){$state.go("Scenario.calculate");});
			}
		},
		getGroupedScenarioElements = function(){
			var tmpGroup = _.groupBy( $scope.scenarioElements, function(element) {return element.group;} ),
				returnGroup = {};
			if ( _.has(tmpGroup, 'Cost Assumption') && _.has(tmpGroup, 'Non-Marketing Drivers') ) {
				returnGroup = _.omit( tmpGroup, 'Cost Assumption', 'Non-Marketing Drivers' );
				returnGroup.Assumptions = _.union( tmpGroup['Cost Assumption'], tmpGroup['Non-Marketing Drivers'] );
			} else if ( _.has(tmpGroup, 'Cost Assumption') ) {
				returnGroup = _.omit( tmpGroup, 'Cost Assumption' );
				returnGroup.Assumptions = tmpGroup['Cost Assumption'];
			} else if ( _.has(tmpGroup, 'Non-Marketing Drivers') ) {
				returnGroup = _.omit( tmpGroup, 'Non-Marketing Drivers' );
				returnGroup.Assumptions = tmpGroup['Non-Marketing Drivers'];
			} else {
				returnGroup = tmpGroup;
			}
			return returnGroup;
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

		$scope.updateCalculateState = function(response) {
			var currentState = ScenarioStatesService.getScenarioState(response),
	        	setState;
            _.each($scope.scenarioStates, function(v, k) {
                if (v.message === currentState.message) { setState = k; }
            });
            $scope.setState(setState);
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

		$scope.setReadOnlyMode = function(mode) {
			if(typeof mode !== 'undefined') {
				$scope.readOnlyMode = mode;
			}

			return $scope.readOnlyMode;
		};

		$scope.disableSimulateButton = function(state) {
			if(!_.isUndefined(state)) {
				$scope.simulateButtonDisabled = state;
			}
			return $scope.simulateButtonDisabled;
		};

		$scope.isScenarioStrategy = function() {
			return $scope.scenario.type === 'Strategy';
		};

		$scope.$on(EVENTS.pivotTableStatusChange, function(event, data) {
			$scope.pivotTableSaveStatus = data.status;
		});

		$scope.$on('$locationChangeStart', function(){
			$scope.getlocation();
		});

		init();
	}]);