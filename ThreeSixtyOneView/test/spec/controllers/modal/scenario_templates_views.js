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

		var baseScenarioPromise = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(baseScenario));
					return this;
				}
			};
		};

		var baseTemplatePromise = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(baseTemplate));
					return this;
				}
			};
		};

		var modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };

		spyOn(ManageScenariosService, 'getBase').and.callFake(baseScenarioPromise);
		spyOn(ManageTemplatesService, 'get').and.callFake(baseTemplatePromise);
		spyOn(ManageTemplatesService, 'create').and.callFake(baseTemplatePromise);

		ctrl = $controller('ScenarioTemplatesViewsCtrl', {
			$scope: scope,
			$modalInstance: modalInstance,
			data: JSON.parse(scenarioTemplatesViewsCtrlModalData)
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
		expect(ManageScenariosService.getBase).toHaveBeenCalled();
		expect(ManageTemplatesService.get).toHaveBeenCalled();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(scenarioTemplatesViewsCtrlSignature);
	});

	it('should create draft template', function() {
		scope.createDraftTemplate();
		expect(ManageTemplatesService.create).toHaveBeenCalled();
		expect(scope.template.id).toBe(JSON.parse(baseTemplate).id);
	});

	it('should set the time granularity', function() {
		scope.dimensions = JSON.parse(dimensionTree);
		scope.setTimeGranularity('QUARTER');
		expect(scope.timeGranularity).toBe('QUARTER');
		expect(scope.filteredTimeDimension.members.length).toBe(3);
	});

	it('should get the time granularity', function() {
		scope.dimensions = JSON.parse(dimensionTree);
		scope.setTimeGranularity('QUARTER');
		expect(scope.getTimeGranularity()).toBe('QUARTER');
	});

	it('should set added dimension members', function() {
		scope.setAddedDimensionMembers(JSON.parse(dimensionTree));
		expect(scope.addedDimensionMembers).toEqual(JSON.parse(dimensionTree));
	});

	it('should get added dimension members', function() {
		scope.setAddedDimensionMembers(JSON.parse(dimensionTree));
		expect(scope.getAddedDimensionMembers()).toEqual(JSON.parse(dimensionTree));
	});
});
