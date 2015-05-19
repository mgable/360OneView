/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe("PivotBuilderCtrl: PivotBuilderCtrl", function() {
	var scope, EVENTS, DialogService, ManageAnalysisViewsService, PivotViewService, ctrl,
		signature = ['viewData','added','deleteItem','addItem','replaceItem','filtersModal','getViewsList','getDimensions','openAllViewsModal','getPivotBuilderItems','getViewData','revertView','startSaveAs','submitSaveAs','cancelSaveAs','startRename','showTable','pivotBuilderItems','saveAs','dragOptions','determineTimeDisability','saveDraftView','lockVariableDimension'];

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function($rootScope, $controller, _DialogService_, _ManageAnalysisViewsService_, _PivotViewService_) {
		scope = $rootScope.$new();
		DialogService = _DialogService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
		PivotViewService = _PivotViewService_;

		scope.viewData = JSON.parse(scenarioMockData.touchpointView);
		scope.added = {};
		scope.determineTimeDisability = jasmine.any;
		scope.saveDraftView = jasmine.any;
		scope.lockVariableDimension = jasmine.any;

		ctrl = $controller('PivotBuilderCtrl', {
			$scope: scope
		});

		spyOn(PivotViewService, 'deleteItem').and.callThrough();
		spyOn(PivotViewService, 'addItem').and.callThrough();
		spyOn(PivotViewService, 'replaceItem').and.callThrough();
		spyOn(DialogService, 'filtersModal').and.callThrough();
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
});