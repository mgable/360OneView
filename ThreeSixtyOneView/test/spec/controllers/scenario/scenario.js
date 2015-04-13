/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: main scenario CTRL', function() {
	var ScenarioAnalysisElements, AnalyticCalculationsService, ScenarioStatesService, event;

	var $httpBackend, $rootScope, $state, $controller, $q, scope, CONFIG, EVENTS, SERVER;

	var data, ctrl, deferred, scenarios, signature ;

	var apiElements = ['this', 'gotoScenarioCalculate', 'getProject', 'init', 'getDetails', 'goto', 'showDetails', 'isActiveItem', 'getData', 'isMasterProjectScenario', 'getSorter', 'getCount', 'setFilter', 'create', 'toggleFavorite', 'isFavorite', 'action']

	beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

	beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$state_, _$controller_, _$q_, _CONFIG_, _EVENTS_){
		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		$q = _$q_;
		scope = $rootScope.$new();
		CONFIG = _CONFIG_;
		EVENTS = _EVENTS_;
	}));

	beforeEach(inject(function(_AnalyticCalculationsService_, _ScenarioStatesService_) {
		AnalyticCalculationsService = _AnalyticCalculationsService_;
		ScenarioStatesService = _ScenarioStatesService_;

		$state.current.url = scenarioRoutes[0];

		ctrl = $controller('ScenarioCtrl', {
			$scope: scope,
			Project: JSON.parse(project),
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
});