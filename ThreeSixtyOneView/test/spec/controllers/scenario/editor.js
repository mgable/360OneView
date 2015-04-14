/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: scenario editor CTRL', function() {
	var PivotMetaService, PivotService, ManageAnalysisViewsService, ScenarioStatesService, event;

	var $httpBackend, $rootScope, $state, $controller, $q, scope, CONFIG, EVENTS, SERVER;

	var ctrl, signature ;

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

	beforeEach(inject(function(_PivotMetaService_, _PivotService_, _ManageAnalysisViewsService_, _ScenarioStatesService_) {
		PivotMetaService = _PivotMetaService_;
		PivotService = _PivotService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
		ScenarioStatesService = _ScenarioStatesService_;

		$state.current.url = scenarioRoutes[0];
		scope.scenario = {
			id: scenarioId
		};
		scope.selectedScenarioElement = {
			cubeMeta: JSON.parse(cubeMeta)
		};

		spyOn(scope, "$on");

		ctrl = $controller('ScenarioEditorCtrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		signature = editorCtrlSignature;
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should set all event handlers', function() {
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.scenarioElementChange, jasmine.any(Function));
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.broadcastStates, jasmine.any(Function));
	});
});