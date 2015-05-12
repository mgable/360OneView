'use strict';

describe('Controller: ScenarioTemplatesChooseDefaultsCtrl', function () {

	var ctrl, $rootScope, $state, $controller, scope, PivotMetaService, PivotViewService, datepickerConfig, MetaDataService, DialogService, ManageScenariosService, EVENTS;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$rootScope_, _$state_, _$controller_, _EVENTS_, _PivotMetaService_, _PivotViewService_, _MetaDataService_, _DialogService_, _ManageScenariosService_) {
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		EVENTS = _EVENTS_;
		PivotMetaService = _PivotMetaService_;
		PivotViewService =_PivotViewService_;
		MetaDataService = _MetaDataService_;
		DialogService = _DialogService_;
		ManageScenariosService = _ManageScenariosService_;

		scope = $rootScope.$new();
	}));

	beforeEach(inject(function() {

		var baseScenarioPromise = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(baseScenario));
					return this;
				}
			};
		};

		// spyOn(ManageScenariosService, 'getBase').and.callFake(baseScenarioPromise);
		spyOn(scope, '$broadcast');
		spyOn(scope, '$on');

		// set up methods inherited from the parent controller
		scope.getSpendCube = function() {
			return JSON.parse(dimensionTree);
		};
		scope.getDefaultView = function() {
			return JSON.parse(touchpointView);
		};
		scope.template = JSON.parse(baseTemplate);

		ctrl = $controller('ScenarioTemplatesChooseDefaultsCtrl', {
			$scope: scope
		});

	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(scenarioTemplatesChooseDefaultsCtrlSignature);
	});
});
