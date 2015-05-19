/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe("ExportCtrl: ExportCtrl", function(){
	var scope, ExportResourceService, timeout, DialogService, PivotMetaService, CONFIG, PivotViewService, ctrl,
		signature = ['setupExportView','deleteItem','addItem','replaceItem','filtersModal','getDimensions','getExportViewDataRows','requestExport','downloadFile','cancelExport','exportViewData','addedExportFilters','categorizedExportValue','exportAddedDimensions','isExportInProgress','dragOptions'];

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function($rootScope, $controller, $timeout, _ExportResourceService_, _DialogService_, _PivotMetaService_, _PivotViewService_, _CONFIG_) {
		scope = $rootScope.$new();
		timeout = $timeout;
		CONFIG = _CONFIG_;
		ExportResourceService = _ExportResourceService_;
		DialogService = _DialogService_;
		PivotMetaService = _PivotMetaService_;
		PivotViewService = _PivotViewService_;

		ctrl = $controller('ExportCtrl', {
			$scope: scope
		});

		spyOn(PivotViewService, 'deleteItem').and.callThrough();
		spyOn(PivotViewService, 'addItem').and.callThrough();
		spyOn(PivotViewService, 'replaceItem').and.callThrough();
		spyOn(DialogService, 'filtersModal').and.callThrough();
		spyOn(ExportResourceService, 'requestExport').and.callThrough();
		spyOn(ExportResourceService, 'downloadFile').and.callThrough();
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should set up export view', function() {
		scope.viewData = JSON.parse(scenarioMockData.touchpointView);
		scope.setupExportView();
		var testView = JSON.parse(scenarioMockData.touchpointView);
		testView.rows = testView.rows.concat(testView.columns);
		testView.columns = [];

		expect(scope.exportViewData).toEqual(testView);
	});

	it('should delete a pivot builder item', function() {
		scope.exportViewData = JSON.parse(scenarioMockData.touchpointView);
		scope.exportAddedDimensions = {};
		scope.deleteItem(0);

		expect(PivotViewService.deleteItem).toHaveBeenCalled();
	});

	it('should add a pivot builder item', function() {
		scope.exportViewData = JSON.parse(scenarioMockData.touchpointView);
		scope.exportAddedDimensions = {};
		scope.lockedDimensions = {};
		scope.addItem({label: 'test', dimensionId: 1, levelId: 2});

		expect(PivotViewService.addItem).toHaveBeenCalled();
	});

	it('should replace a pivot builder item', function() {
		scope.exportViewData = JSON.parse(scenarioMockData.touchpointView);
		scope.exportAddedDimensions = {};
		scope.replaceItem({label: 'new label', dimensionId: 1, levelId: 2}, 'old label');

		expect(PivotViewService.replaceItem).toHaveBeenCalled();
	});

	it('should get the loaded dimensions', function() {
		scope.dimensions = {a: 'b'};

		expect(scope.getDimensions()).toEqual({a: 'b'});
	});

	it('should get pivot view rows', function() {
		scope.exportViewData = JSON.parse(scenarioMockData.touchpointView);

		expect(scope.getExportViewDataRows()).toEqual(JSON.parse(scenarioMockData.touchpointView).rows);
	});

	it('should open the filters modal', function() {
		scope.filtersModal();

		expect(DialogService.filtersModal).toHaveBeenCalled();
	});

	it('should request an export process', function() {
		scope.selectedScenarioElement = {id: 1, name: 'test'};
		scope.requestExport();

		expect(ExportResourceService.requestExport).toHaveBeenCalled();
		expect(scope.isExportInProgress).toBeTruthy();
		expect(scope.isDownloadReady).toBeFalsy();
	});

	it('should download the exported file', function() {
		scope.downloadFile();

		expect(ExportResourceService.downloadFile).toHaveBeenCalled();
	});

	it('should cancel the export process', function() {
		scope.cancelExport();

		expect(scope.statusMessage).toBe('');
		expect(scope.isExportInProgress).toBeFalsy();
		expect(scope.isDownloadReady).toBeFalsy();
	});
});