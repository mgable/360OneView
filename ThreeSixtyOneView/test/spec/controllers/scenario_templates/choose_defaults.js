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
					callback(JSON.parse(templateMockData.baseScenario));
					return this;
				}
			};
		};

		spyOn(PivotViewService, 'addItem').and.callThrough();
		spyOn(PivotViewService, 'deleteItem').and.callThrough();
		spyOn(PivotViewService, 'replaceItem').and.callThrough();
		spyOn(DialogService, 'filtersModal').and.callThrough();
		spyOn(scope, '$emit');
		spyOn(scope, '$on');

		// set up methods inherited from the parent controller
		scope.getSpendCube = function() {
			return JSON.parse(dimensionTree);
		};
		scope.getDefaultView = function() {
			return JSON.parse(touchpointView);
		};
		scope.template = JSON.parse(templateMockData.baseTemplate);
		scope.templateType = {label: 'Strategy'};

		ctrl = $controller('ScenarioTemplatesChooseDefaultsCtrl', {
			$scope: scope
		});

	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
		expect(scope.$on).toHaveBeenCalled();
		expect(scope.$emit).toHaveBeenCalled();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(templateMockData.scenarioTemplatesChooseDefaultsCtrlSignature);
	});

	it('should get pivot builder items', function() {
		var output = scope.pivotBuilderItems;
		expect(scope.getPivotBuilderItems()).toEqual(output);
	});

	it('should get the pivot builder view data', function() {
		var output = scope.viewData.rows;
		expect(scope.getViewData('rows')).toEqual(output);

		output = scope.viewData.columns;
		expect(scope.getViewData('columns')).toEqual(output);
	});

	it('should get loaded dimensions', function() {
		var output = scope.spendCube;
		expect(scope.getDimensions()).toEqual(output);
	});

	it('should add an item to the pivot builder view', function() {
		scope.addItem({item: 'test'}, 'rows');
		expect(PivotViewService.addItem).toHaveBeenCalled();
	});

	it('should delete an item from the pivot builder view', function() {
		scope.deleteItem(0, 'rows');
		expect(PivotViewService.deleteItem).toHaveBeenCalled();
	});

	it('should replace an item in the pivot builder view', function() {
		scope.replaceItem({item: 'test'}, 'oldLabel', 'rows');
		expect(PivotViewService.replaceItem).toHaveBeenCalled();
	});

	it('should open the filters modal', function() {
		scope.filtersModal();
		expect(DialogService.filtersModal).toHaveBeenCalled();
	});

	it('should determine date picker visibility', function() {
		scope.templateType.label = 'Action';
		expect(scope.isDatePickerVisible()).toBeTruthy();
		scope.templateType.label = 'Strategy';
		expect(scope.isDatePickerVisible()).toBeFalsy();
	});

	it('should set from date', function() {
		var time = 'QUARTER';
		scope.setFromDate(time);
		expect(scope.fromDate).toBe(time);
	});

	it('should set to date', function() {
		var time = 'MONTH';
		scope.setToDate(time);
		expect(scope.toDate).toBe(time);
	});
});
