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

		// spyOn(ImportResourceService, 'uploadFile').and.callThrough();
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(signature);
	});
});