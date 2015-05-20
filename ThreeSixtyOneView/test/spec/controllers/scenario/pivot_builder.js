/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe("PivotBuilderCtrl: PivotBuilderCtrl", function() {
	var scope, EVENTS, DialogService, ManageAnalysisViewsService, PivotViewService, ctrl,
		signature = ['viewData','added','loadView','renameView','createView','deleteView','deleteItem','addItem','replaceItem','filtersModal','getViewsList','getDimensions','openAllViewsModal','getPivotBuilderItems','getViewData','revertView','startSaveAs','submitSaveAs','cancelSaveAs','startRename','showTable','pivotBuilderItems','saveAs','dragOptions','determineTimeDisability','saveDraftView','lockVariableDimension'];

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function($rootScope, $controller, _DialogService_, _ManageAnalysisViewsService_, _PivotViewService_, _EVENTS_) {
		scope = $rootScope.$new();
		DialogService = _DialogService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
		PivotViewService = _PivotViewService_;
		EVENTS = _EVENTS_;

		scope.viewData = JSON.parse(scenarioMockData.touchpointView);
		scope.added = {};
		scope.determineTimeDisability = jasmine.any;
		scope.saveDraftView = jasmine.any;
		scope.lockVariableDimension = jasmine.any;
		scope.loadView = jasmine.any;
		scope.renameView = jasmine.any;
		scope.createView = jasmine.any;
		scope.deleteView = jasmine.any;

		ctrl = $controller('PivotBuilderCtrl', {
			$scope: scope
		});

		spyOn(scope, '$on');
		spyOn(PivotViewService, 'deleteItem').and.callThrough();
		spyOn(PivotViewService, 'addItem').and.callThrough();
		spyOn(PivotViewService, 'replaceItem').and.callThrough();
		spyOn(DialogService, 'filtersModal').and.callThrough();
		spyOn(DialogService, 'openLightbox').and.callThrough();
		spyOn(scope, 'loadView').and.callThrough();
		spyOn(scope, 'renameView').and.callThrough();
		spyOn(scope, 'createView').and.callThrough();
		spyOn(scope, 'deleteView').and.callThrough();
		spyOn(scope, 'cancelSaveAs').and.callThrough();
		spyOn(ManageAnalysisViewsService, 'defaultView').and.callThrough();
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should delete a pivot builder item from row', function() {
		scope.deleteItem(0, 'rows');

		expect(PivotViewService.deleteItem).toHaveBeenCalled();
	});

	it('should delete a pivot builder item from column', function() {
		scope.deleteItem(0, 'columns');

		expect(PivotViewService.deleteItem).toHaveBeenCalled();
	});

	it('should add a pivot builder item', function() {
		scope.addItem({label: 'test', dimensionId: 1, levelId: 2}, 'rows');

		expect(PivotViewService.addItem).toHaveBeenCalled();
	});

	it('should add a pivot builder item', function() {
		scope.addItem({label: 'test', dimensionId: 1, levelId: 2}, 'columns');

		expect(PivotViewService.addItem).toHaveBeenCalled();
	});

	it('should replace a pivot builder item', function() {
		scope.replaceItem({label: 'new label', dimensionId: 1, levelId: 2}, 'old label', 'rows');

		expect(PivotViewService.replaceItem).toHaveBeenCalled();
	});

	it('should replace a pivot builder item', function() {
		scope.replaceItem({label: 'new label', dimensionId: 1, levelId: 2}, 'old label', 'columns');

		expect(PivotViewService.replaceItem).toHaveBeenCalled();
	});

	it('should get the view data', function() {
		expect(scope.getViewsList()).toEqual(scope.viewsList);
	});

	it('should get the list of dimensions', function() {
		scope.dimensions = JSON.parse(scenarioMockData.dimensionTree);

		expect(scope.getDimensions()).toEqual(scope.dimensions);
	});

	it('should get the list of pivot builder elements (rows, columns)', function() {
		expect(scope.getPivotBuilderItems()).toEqual(scope.pivotBuilderItems);
	});

	it('should get items in a pivot table element', function() {
		expect(scope.getViewData('rows')).toEqual(scope.viewData.rows);
		expect(scope.getViewData('columns')).toEqual(scope.viewData.columns);
	});

	it('should open the list of all views in a modal', function() {
		scope.openAllViewsModal();

		expect(DialogService.openLightbox).toHaveBeenCalled();
	});

	it('should revert a draft view to its original', function() {
		scope.isViewDraft = function() {return true;}
		scope.viewsList = [];
		scope.viewsList.push(angular.copy(scope.viewData));
		scope.viewsList.push(angular.copy(scope.viewData));
		scope.viewsList[1].name = scope.viewData.name.substring(8);
		scope.revertView();

		expect(scope.loadView).toHaveBeenCalled();
	});

	it('should not change the view on revert request when view is not changed', function() {
		scope.isViewDraft = function() {return false;}
		scope.viewsList = [];
		scope.viewsList.push(angular.copy(scope.viewData));
		scope.viewsList.push(angular.copy(scope.viewData));
		scope.viewsList[1].name = scope.viewData.name.substring(8);
		scope.revertView();

		expect(scope.loadView).not.toHaveBeenCalled();
	});

	it('should start the save as process', function() {
		scope.startSaveAs('test');

		expect(scope.saveAsName).toBe('test');
		expect(scope.saveAs).toBeTruthy();
	});

	it('should start the rename process', function() {
		scope.startRename();

		expect(scope.saveAsName).toBe(scope.viewData.name);
		expect(scope.saveAs).toBeTruthy();
	});

	it('should cancel the save as/rename process', function() {
		scope.saveAs = true;
		scope.cancelSaveAs();

		expect(scope.saveAs).toBeFalsy();
	});

	it('should submit the rename request', function() {
		scope.isViewDraft = function() {return false;}
		scope.startRename();
		scope.saveAsName = 'test';
		scope.submitSaveAs();

		expect(scope.viewData.name).toBe('test');
		expect(scope.renameView).toHaveBeenCalled();
		expect(scope.cancelSaveAs).toHaveBeenCalled();
	});

	it('should submit the save as request', function() {
		scope.isViewDraft = function() {return false;}
		scope.startSaveAs('test');
		scope.saveAsName = 'test 2';
		scope.submitSaveAs();

		expect(scope.createView).toHaveBeenCalled();
		expect(ManageAnalysisViewsService.defaultView).toHaveBeenCalled();
		expect(scope.cancelSaveAs).toHaveBeenCalled();
	});

	it('should submit the save as request and delete the current draft view', function() {
		scope.isViewDraft = function() {return true;}
		scope.startSaveAs('test');
		scope.saveAsName = 'test 2';
		scope.submitSaveAs();

		expect(scope.createView).toHaveBeenCalled();
		expect(scope.deleteView).toHaveBeenCalled();
		expect(scope.cancelSaveAs).toHaveBeenCalled();
	});
});