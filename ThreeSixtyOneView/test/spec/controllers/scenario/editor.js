/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: scenario editor CTRL', function() {
	var PivotMetaService, PivotService, ManageAnalysisViewsService, ScenarioStatesService, event;

	var $httpBackend, $rootScope, $state, $controller, $q, scope, CONFIG, EVENTS, SERVER;

	var ctrl, signature ;

	beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

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

		$state.current.url = scenarioRoutes[0];
		scope.scenario = {
			id: scenarioId
		};
		scope.selectedScenarioElement = {
			cubeMeta: JSON.parse(cubeMeta)
		};

		var returnThen = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(touchpointView));
					return this;
				}
			};
		};

		spyOn(scope, "$on");

		spyOn(ManageAnalysisViewsService, 'deleteView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'getView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'createView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'renameView').and.callFake(returnThen);
		spyOn(ManageAnalysisViewsService, 'defaultView').and.callFake(returnThen);
		spyOn(PivotMetaService, 'determineTimeDisability').and.returnValue(false);
		spyOn(PivotMetaService, 'getAddedFilters').and.returnValue({value: 'test'});
		spyOn(PivotMetaService, 'setUpAddedLevels').and.returnValue({value: 'test'});
		spyOn(PivotMetaService, 'updateView').and.callFake(returnThen);

		ctrl = $controller('ScenarioEditorCtrl', {
			$scope: scope
		});

		scope.viewsList = views;
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

	it('verify initial state variable values', function() {
		expect(scope.draftView).toBeFalsy();
		expect(scope.timeDisabled).toBeFalsy();
		expect(scope.readOnlyMode).toBeFalsy();
	});

	it('should delete a view', function() {
		scope.draftView = true;
		scope.deleteView(cubeId, viewId);

		expect(ManageAnalysisViewsService.deleteView).toHaveBeenCalledWith(viewId, cubeId);
		expect(scope.viewsList).toEqual([]);
		expect(scope.draftView).toBeFalsy();
	});

	it('should load a view', function() {
		var view = JSON.parse(touchpointView);
		scope.loadView(cubeId, viewId);

		expect(ManageAnalysisViewsService.getView).toHaveBeenCalledWith(viewId, cubeId);
		expect(scope.viewData).toEqual(view);
		expect(PivotMetaService.getAddedFilters).toHaveBeenCalledWith(view.filters, scope.dimensions);
		expect(scope.addedFilters).toEqual({value: 'test'});
		expect(PivotMetaService.setUpAddedLevels).toHaveBeenCalledWith(view.columns.concat(view.rows));
		expect(scope.added).toEqual({value: 'test'});
		expect(scope.timeDisabled).toBeFalsy();
	});

	it('should delete the draft view when loading another view', function() {
		var view = JSON.parse(touchpointView),
			viewsListLength = 0;
		scope.draftView = true;
		scope.viewsList[0].id = 2;
		scope.viewsList[0].name = 'Draft - test';
		scope.viewsList[0].isDraft = true;
		viewsListLength = scope.viewsList.length;
		scope.loadView(cubeId, viewId);

		expect(scope.viewsList.length).toBe(viewsListLength-1);
	});

	it('should delete a view', function() {
		scope.viewsList[0].id = 9;
		scope.viewsList[0].name = 'Region By Month';
		scope.viewsList[0].isDraft = true;
		scope.deleteView(cubeId, viewId);

		expect(ManageAnalysisViewsService.deleteView).toHaveBeenCalledWith(viewId, cubeId);
		expect(scope.viewsList).toEqual([]);
	});

	it('should create a view', function() {
		var newView = angular.copy(JSON.parse(touchpointView)),
			viewsListLength = 0;
		viewsListLength = scope.viewsList.length;
		scope.createView(cubeId, newView);

		expect(scope.viewsList.length).toBe(viewsListLength+1);
	});

	it('should rename the view', function() {
		var newView = angular.copy(JSON.parse(touchpointView)),
			originalViewName = newView.name;
		newView.name = 'some random name';
		scope.renameView(cubeId, newView);

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

	xit('should save a draft view', function() {
		var draftView = angular.copy(JSON.parse(touchpointView));
		draftView.name = 'Draft - ' + draftView.name;
		scope.viewsList.push(draftView);
		scope.draftView = true;
		scope.viewData = draftView;
		scope.saveView();

		expect(PivotMetaService.updateView).toHaveBeenCalled();
	});

	it('should not save anything when view is not draft', function() {});
});