/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe("AnalysisElementCtrl: AnalysisElementCtrl", function(){
	var scope, EVENTS, DialogService, ManageScenariosService, ScenarioService, ctrl,
		signature = ['isHiddenElement','getGroupedScenarioElements','openScenarioElementFileModal','openScenarioElementCopyModal','setFromDate','setToDate','scenario','project'];

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function($rootScope, $controller, _EVENTS_, _DialogService_, _ManageScenariosService_, _ScenarioService_) {
		scope = $rootScope.$new();
		EVENTS = _EVENTS_;
		DialogService = _DialogService_;
		ManageScenariosService = _ManageScenariosService_;
		ScenarioService = _ScenarioService_;

		scope.scenario = {};
		scope.project = {uuid: 4};

		ctrl = $controller('AnalysisElementCtrl', {
			$scope: scope
		});

		spyOn(scope, "$on");
		spyOn(DialogService, 'openLightbox').and.callThrough();
		spyOn(ScenarioService, 'setModelingTime').and.callThrough();
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should hide the marketing plan scenario element', function() {
		expect(scope.isHiddenElement({group: 'Marketing Plan'})).toBeTruthy();
	});

	it('should not hide scenario elements other than marketing plan', function() {
		expect(scope.isHiddenElement({group: 'Competitive Spend'})).toBeFalsy();
	});

	it('should get grouped scenario elements', function() {
		scope.groupedScenarioElements = ['a', 'b', 'c'];
		expect(scope.getGroupedScenarioElements()).toEqual(['a', 'b', 'c']);
	});

	it('should open scenario analysis elements list modal', function() {
		scope.openScenarioElementFileModal(scenarioMockData.scenarioId, JSON.parse(scenarioMockData.cubeScenarioElements)[0], false);
		expect(DialogService.openLightbox).toHaveBeenCalled();
	});

	it('should open scenario analysis elements copy modal', function() {
		scope.openScenarioElementCopyModal(scenarioMockData.scenarioId, JSON.parse(scenarioMockData.cubeScenarioElements)[0]);
		expect(DialogService.openLightbox).toHaveBeenCalled();
	});

	it('should set from date for modeling period', function() {
		scope.setFromDate({id:2, label: 'QUARTER'});
		expect(scope.fromDate).toEqual({id:2, label: 'QUARTER'});
		expect(scope.scenario.modellingStartTime).toBe(2);
		expect(ScenarioService.setModelingTime).toHaveBeenCalled();
	});

	it('should set to date for modeling period', function() {
		scope.setToDate({id:2, label: 'QUARTER'});
		expect(scope.toDate).toEqual({id:2, label: 'QUARTER'});
		expect(scope.scenario.modellingEndTime).toBe(2);
		expect(ScenarioService.setModelingTime).toHaveBeenCalled();
	});
});