'use strict';

describe('Controller: ScenarioTemplatesViewsCtrl', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ctrl, $rootScope, $state, $controller, $modalInstance, CONFIG, EVENTS, scope, DialogService, ManageTemplatesService, DimensionService,
		MetaDataService, ManageScenariosService, ScenarioService, PivotMetaService, AnalyticCalculationsService, data;

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$rootScope_, _$state_, _$controller_, _CONFIG_, _EVENTS_, _DialogService_, _ManageTemplatesService_,
			_DimensionService_, _MetaDataService_, _ManageScenariosService_, _ScenarioService_, _PivotMetaService_, _AnalyticCalculationsService_) {
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		CONFIG = _CONFIG_;
		EVENTS = _EVENTS_;
		DialogService = _DialogService_;
		ManageTemplatesService = _ManageTemplatesService_;
		DimensionService = _DimensionService_;
		MetaDataService = _MetaDataService_;
		ManageScenariosService = _ManageScenariosService_;
		ScenarioService = _ScenarioService_;
		PivotMetaService = _PivotMetaService_;
		AnalyticCalculationsService = _AnalyticCalculationsService_;
		
		scope = $rootScope.$new();
	}));

	beforeEach(inject(function() {

		var returnThen = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(masterProject));
					return this;
				}
			};
		};

		var modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };

		// spyOn(ManageTemplatesService, 'getAll').and.callFake(returnThen);

		ctrl = $controller('ScenarioTemplatesViewsCtrl', {
			$scope: scope,
			$modalInstance: modalInstance,
			data: JSON.parse(scenarioTemplatesViewsCtrlModalData)
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(scenarioTemplatesViewsCtrlSignature);
	});
});
