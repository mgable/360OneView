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

		var scenarioPromise = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(scenarios)[0]);
					return this;
				}
			};
		};

		var modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            close: jasmine.createSpy('modalInstance.close')
        };

		spyOn(ManageScenariosService, 'getBase').and.callFake(baseScenarioPromise);
		spyOn(ManageTemplatesService, 'get').and.callFake(baseTemplatePromise);
		spyOn(ManageTemplatesService, 'create').and.callFake(baseTemplatePromise);
		spyOn(ManageTemplatesService, 'delete').and.callThrough();
		spyOn(ManageTemplatesService, 'update').and.callFake(baseTemplatePromise);
		spyOn(ManageTemplatesService, 'createView').and.callThrough();
		spyOn(ScenarioService, 'create').and.callFake(scenarioPromise);
		spyOn(AnalyticCalculationsService, 'post').and.callFake(scenarioPromise);
		spyOn($rootScope, '$broadcast');
		spyOn($rootScope, '$on');

		ctrl = $controller('ScenarioTemplatesViewsCtrl', {
			$scope: scope,
			$rootScope: $rootScope,
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

	it('should set all event listeners', function() {
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.selectTime, jasmine.any(Function));
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.dimensionsIsLoaded, jasmine.any(Function));
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.flipbookAllowAdvance, jasmine.any(Function));
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

	it('should get spend cube', function() {
		scope.spendCube = JSON.parse(dimensionTree)
		expect(scope.getSpendCube()).toEqual(JSON.parse(dimensionTree));
	});

	it('should set the default view',  function() {
		scope.setDefaultView(JSON.parse(touchpointView));
		expect(scope.defaultView).toEqual(JSON.parse(touchpointView));
	});

	it('should get the default view',  function() {
		scope.defaultView = JSON.parse(touchpointView);
		expect(scope.getDefaultView()).toEqual(JSON.parse(touchpointView));
	});

	it('should set the performance period', function() {
		scope.setPerformancePeriod(10, 12);
		expect(scope.performancePeriod.from).toBe(10);
		expect(scope.performancePeriod.to).toBe(12);
	});

	it('should cancel scenario template creation', function() {
		scope.cancel();
		expect(ManageTemplatesService.delete).not.toHaveBeenCalled();
	});

	it('should cancel scenario template creation and delete draft', function() {
		scope.template.id = 1;
		scope.cancel();
		expect(ManageTemplatesService.delete).toHaveBeenCalled();
	});

	it('should submit scenario template creation', function() {
		scope.submit();
		expect(ManageTemplatesService.update).toHaveBeenCalled();
		expect(ManageTemplatesService.createView).toHaveBeenCalled();
		expect(ScenarioService.create).toHaveBeenCalled();
		expect(AnalyticCalculationsService.post).toHaveBeenCalled();
		expect($rootScope.$broadcast).toHaveBeenCalled();
	});
});
