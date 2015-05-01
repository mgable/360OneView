/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: main scenario CTRL', function() {
	var ScenarioAnalysisElements, AnalyticCalculationsService, ScenarioStatesService, event;

	var $httpBackend, $rootScope, $state, $controller, scope, CONFIG, EVENTS, SERVER;

	var ctrl, signature ;

	beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

	beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$state_, _$controller_, _CONFIG_, _EVENTS_, _SERVER_){
		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		scope = $rootScope.$new();
		CONFIG = _CONFIG_;
		EVENTS = _EVENTS_;
		SERVER = _SERVER_;
	}));

	beforeEach(inject(function(_AnalyticCalculationsService_, _ScenarioStatesService_) {
		AnalyticCalculationsService = _AnalyticCalculationsService_;
		ScenarioStatesService = _ScenarioStatesService_;

		$state.current.url = scenarioRoutes[0];

		spyOn(scope, '$on');
		spyOn($state, 'go');

		ctrl = $controller('ScenarioCtrl', {
			$scope: scope,
			Project: JSON.parse(project),
			Scenario: JSON.parse(scenarios)[2],
			ScenarioAnalysisElements: scenarioElements,
			Calculate: JSON.parse(calculate)
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		signature = scenarioCtrlSignature;
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('the touchpoint scenario element should be selected by default', function() {
		expect(scope.selectedScenarioElement.group).toBe('Marketing Plan');
		expect(scope.selectedScenarioElement.cubeMeta.name).toBe('TOUCHPOINT');
	});

	it('should set all event handlers', function() {
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.pivotTableStatusChange, jasmine.any(Function));
		expect(scope.$on).toHaveBeenCalledWith('$locationChangeStart', jasmine.any(Function));
	});

	it('should set scenario element and file when cube is not changed', function() {
		scope.setScenarioElement(scenarioElement, false);
		expect(scope.selectedScenarioElement).toEqual(scenarioElement);
		expect(scope.selectedScenarioElementsFile).toEqual(scenarioElement.name);
	});

	it('should set scenario element and file when cube is changed', function() {
		scope.setScenarioElement(scenarioElement, true);
		expect(scope.cubeId).toBe(scenarioElement.cubeMeta.id);
		expect(scope.selectedScenarioElement).toEqual(scenarioElement);
		expect(scope.selectedScenarioElementsFile).toEqual(scenarioElement.name);
	});

	it('should set scenario state', function() {
		scope.setState('IN_PROGRESS');
		expect(scope.scenarioState).toEqual({"message": "in_progress","description": "Simulation is in progress","icon": "in_progress"});
	});

	it('should get location of the subview within scenario editor', function() {
		scope.getlocation();
		expect(scope.location).toBe('/edit');
	});

	it('should get results as location if state is calculate', function() {
		$state.current.url = scenarioRoutes[1];
		scope.getlocation();
		expect(scope.location).toBe('/results');
	});

	it('should get results as location if state is results', function() {
		$state.current.url = scenarioRoutes[2];
		scope.getlocation();
		expect(scope.location).toBe('/results');
	});

	it('should change the state to results', function() {
		scope.gotoResults();
		expect($state.go).toHaveBeenCalledWith('Scenario.results');
	});

	it('should get the state of the simulate button', function() {
		expect(scope.simulateButtonDisabled).toBeFalsy();
	});

	it('should set the state of the simulate button', function() {
		scope.disableSimulateButton(true);
		expect(scope.simulateButtonDisabled).toBeTruthy();
		scope.disableSimulateButton(false);
		expect(scope.simulateButtonDisabled).toBeFalsy();
	});
});