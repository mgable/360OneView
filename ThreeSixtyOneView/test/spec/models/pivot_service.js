'use strict';

describe('Service: PivotService', function () {

	var PivotService, PivotModel, backend, pivotUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		pivotUrl = SERVER.server + CONFIG.application.api.pivotdata;
		pivotUrl = pivotUrl.replace(/:elementId/, scenarioMockData.elementId).replace(/:viewId/, scenarioMockData.viewId);
		backend = $httpBackend;

		backend.when('GET', pivotUrl + '/slice').respond(scenarioMockData.pivotSlice);
		backend.when('POST', pivotUrl + '/updateCell', JSON.parse(scenarioMockData.cellValue)).respond(JSON.parse(scenarioMockData.cellValue));
		// backend.when('POST', pivotUrl.substr(0, pivotUrl.search(/:viewId/) - 1) + '?relatedByView=' + viewId, newView).respond(views[views.length - 1]);
	}));

	// Initialize the services
	beforeEach(inject(function (_PivotService_, _PivotModel_) {
		PivotService = _PivotService_;
		PivotModel = _PivotModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(PivotService.resource).toBeDefined();
	});

	describe('API calls', function() {
		afterEach(function() {
			backend.flush();
		});

		it('should get pivot slice', function() {
			PivotService.getSlice(scenarioMockData.elementId, scenarioMockData.viewId).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.pivotSliceTransformed));
			});
		});

		it('should update the pivot table', function() {
			PivotService.updateCell(scenarioMockData.elementId, scenarioMockData.viewId, JSON.parse(scenarioMockData.cellValue)).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.cellValue));
			});
		});
	});

});
