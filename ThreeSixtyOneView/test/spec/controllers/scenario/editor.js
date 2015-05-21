/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: scenario editor CTRL', function() {
	var PivotMetaService, PivotService, ManageAnalysisViewsService, ScenarioStatesService, event;

	var $httpBackend, $rootScope, $state, $controller, $q, scope, CONFIG, EVENTS, SERVER;

	var ctrl, signature ;

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$state_, _$controller_, _$q_, _CONFIG_, _EVENTS_, _SERVER_){
		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		$q = _$q_;
		scope = $rootScope.$new();
		CONFIG = _CONFIG_;
		EVENTS = _EVENTS_;
		SERVER = _SERVER_;
	}));

	beforeEach(inject(function(_PivotMetaService_, _PivotService_, _ManageAnalysisViewsService_, _ScenarioStatesService_) {
		PivotMetaService = _PivotMetaService_;
		PivotService = _PivotService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
		ScenarioStatesService = _ScenarioStatesService_;

		$state.current.url = scenarioMockData.scenarioRoutes[0];
		scope.scenario = {
			id: scenarioMockData.scenarioId
		};
		scope.selectedScenarioElement = {
			id: 22,
			cubeMeta: JSON.parse(scenarioMockData.cubeMeta)
		};
		scope.setReadOnlyMode = jasmine.any;
		scope.disableSimulateButton = jasmine.any;

		var returnThen = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(scenarioMockData.touchpointView));
					return this;
				}
			};
		};

		spyOn(scope, "$on");
		spyOn($rootScope, "$broadcast");

		spyOn(ManageAnalysisViewsService, 'deleteView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'getView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'createView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'renameView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'defaultView').and.callFake(returnThen);
		spyOn(PivotMetaService, 'determineTimeDisability').and.returnValue(false);
		spyOn(PivotMetaService, 'getAddedFilters').and.returnValue({value: 'test'});
		spyOn(PivotMetaService, 'setUpAddedLevels').and.callThrough();
		spyOn(PivotMetaService, 'updateView').and.callFake(returnThen);
		spyOn(PivotMetaService, 'updateFilters').and.callThrough();
		spyOn(PivotMetaService, 'generateCategorizeValueStructure').and.callThrough();
		spyOn(PivotService, 'getSlice').and.callThrough();
		spyOn(scope, 'setReadOnlyMode').and.callThrough();
		spyOn(scope, 'disableSimulateButton').and.callThrough();

		ctrl = $controller('ScenarioEditorCtrl', {
			$scope: scope
		});

		scope.viewsList = scenarioMockData.views;
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		signature = scenarioMockData.editorCtrlSignature;
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should set all event handlers', function() {
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.scenarioElementChange, jasmine.any(Function));
		expect(scope.$on).toHaveBeenCalledWith(EVENTS.broadcastStates, jasmine.any(Function));
	});

	it('verify initial state variable values', function() {
		expect(scope.draftView).toBeFalsy();
		expect(scope.timeDisabled).toBeFalsy();
		expect(scope.readOnlyMode).toBeFalsy();
	});

	it('should delete a view', function() {
		scope.draftView = true;
		scope.deleteView(scenarioMockData.cubeId, scenarioMockData.viewId);

		expect(ManageAnalysisViewsService.deleteView).toHaveBeenCalledWith(scenarioMockData.viewId, scenarioMockData.cubeId);
		expect(scope.viewsList).toEqual([]);
		expect(scope.draftView).toBeFalsy();
	});

	it('should update the filter values in the current view', function() {
		scope.updateFilterValues({a: 'b'});

		expect(scope.addedFilters).toEqual({a: 'b'});
		expect(PivotMetaService.updateFilters).toHaveBeenCalled();
		expect(PivotMetaService.generateCategorizeValueStructure).toHaveBeenCalled();
	});

	it('should load a view', function() {
		var view = JSON.parse(scenarioMockData.touchpointView);
		scope.loadView(scenarioMockData.cubeId, scenarioMockData.viewId);

		expect(ManageAnalysisViewsService.getView).toHaveBeenCalledWith(scenarioMockData.viewId, scenarioMockData.cubeId);
		expect(scope.viewData).toEqual(view);
		expect(PivotMetaService.getAddedFilters).toHaveBeenCalledWith(view.filters, scope.dimensions);
		expect(scope.addedFilters).toEqual({value: 'test'});
		expect(PivotMetaService.setUpAddedLevels).toHaveBeenCalledWith(view.columns.concat(view.rows));
		expect(scope.added).toEqual({QUARTER: true, Hotel: true});
		expect(scope.timeDisabled).toBeFalsy();
	});

	it('should delete the draft view when loading another view', function() {
		var view = JSON.parse(scenarioMockData.touchpointView),
			viewsListLength = 0;
		scope.draftView = true;
		scope.viewsList[0].id = 2;
		scope.viewsList[0].name = 'Draft - test';
		scope.viewsList[0].isDraft = true;
		viewsListLength = scope.viewsList.length;
		scope.loadView(scenarioMockData.cubeId, scenarioMockData.viewId);

		expect(scope.viewsList.length).toBe(viewsListLength-1);
	});

	it('should delete a view', function() {
		scope.viewsList[0].id = 9;
		scope.viewsList[0].name = 'Region By Month';
		scope.viewsList[0].isDraft = true;
		scope.deleteView(scenarioMockData.cubeId, scenarioMockData.viewId);

		expect(ManageAnalysisViewsService.deleteView).toHaveBeenCalledWith(scenarioMockData.viewId, scenarioMockData.cubeId);
		expect(scope.viewsList).toEqual([]);
	});

	it('should create a view', function() {
		var newView = angular.copy(JSON.parse(scenarioMockData.touchpointView)),
			viewsListLength = 0;
		viewsListLength = scope.viewsList.length;
		scope.createView(scenarioMockData.cubeId, newView);

		expect(scope.viewsList.length).toBe(viewsListLength+1);
	});

	it('should rename the view', function() {
		var newView = angular.copy(JSON.parse(scenarioMockData.touchpointView)),
			originalViewName = newView.name;
		newView.name = 'some random name';
		scope.renameView(scenarioMockData.cubeId, newView);

		expect(scope.viewsList[0].name).toBe(originalViewName);
	});

	it('should save draft view when view is not draft', function() {
		var viewsCount = scope.viewsList.length;
		scope.draftView = false;
		scope.saveDraftView();

		expect(scope.draftView).toBeTruthy();
		expect(ManageAnalysisViewsService.defaultView).toHaveBeenCalled();
		expect(scope.viewsList.length).toBe(viewsCount+1);
	});

	it('should save draft view when view is  draft', function() {
		scope.draftView = true;
		scope.saveDraftView();

		expect(PivotMetaService.updateView).toHaveBeenCalled();
	});

	it('should save a draft view', function() {
		var draftView = angular.copy(JSON.parse(scenarioMockData.touchpointView));
		draftView.name = 'Draft - ' + draftView.name;
		scope.draftView = true;
		scope.viewData = draftView;
		scope.saveView();

		expect(PivotMetaService.updateView).toHaveBeenCalled();
		expect(PivotMetaService.setUpAddedLevels).toHaveBeenCalled();
	});

	it('should not save anything when view is not draft', function() {
		scope.draftView = false;
		scope.saveView();

		expect(PivotMetaService.updateView).not.toHaveBeenCalled();
		expect(PivotMetaService.setUpAddedLevels).not.toHaveBeenCalled();
	});

	it('should determine if the current view is draft', function() {
		scope.isViewDraft(false);
		expect(scope.draftView).toBeFalsy();

		scope.isViewDraft(true);
		expect(scope.draftView).toBeTruthy();

		expect(scope.isViewDraft()).toBe(scope.draftView);
	});

	it('should reload the pivot table', function() {
		scope.spread = {
			updateSheet: jasmine.any,
			sheet: {}
		};
		scope.loadPivotTable(scope.selectedScenarioElement, scope.viewData);

		expect(scope.spread.sheet.loading).toBeTruthy();
		expect(PivotService.getSlice).toHaveBeenCalledWith(scope.selectedScenarioElement.id, scope.viewData.id);
		expect($rootScope.$broadcast).toHaveBeenCalledWith(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loading);
	});

	it('should set the editor read only when calculation starts', function() {
		scope.readOnlyMode = false;
		scope.determineReadOnlyMode('in_progress');

		expect(scope.setReadOnlyMode).toHaveBeenCalledWith(true);
		expect(scope.disableSimulateButton).toHaveBeenCalledWith(true);
	});

	it('should not change anything if editor is already in read only mode and calculation is in progress', function() {
		scope.readOnlyMode = true;
		scope.determineReadOnlyMode('in_progress');
		
		expect(scope.setReadOnlyMode).not.toHaveBeenCalledWith(true);
		expect(scope.disableSimulateButton).not.toHaveBeenCalledWith(true);
	});

	it('should remove the read only mode after calculation is done', function() {
		scope.readOnlyMode = true;
		scope.determineReadOnlyMode('SUCCESSFUL');
		
		expect(scope.setReadOnlyMode).toHaveBeenCalledWith(false);
		expect(scope.disableSimulateButton).toHaveBeenCalledWith(false);
	});

	it('should not remove the read only mode after calculation is done in plan of record', function() {
		scope.scenario.isPlanOfRecord = true;
		scope.readOnlyMode = true;
		scope.determineReadOnlyMode('SUCCESSFUL');
		
		expect(scope.setReadOnlyMode).not.toHaveBeenCalledWith(false);
		expect(scope.disableSimulateButton).toHaveBeenCalledWith(false);
	});
});