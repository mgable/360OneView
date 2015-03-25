'use strict';

describe('Service: PivotService', function () {

	var PivotService, PivotModel, backend, pivotUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		pivotUrl = SERVER.server + CONFIG.application.api.pivotdata;
		pivotUrl = pivotUrl.replace(/:elementId/, elementId).replace(/:viewId/, viewId);
		backend = $httpBackend;

		backend.when('GET', pivotUrl + '/slice').respond(pivotSlice);
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
			PivotService.getSlice(elementId, viewId);
		});
	});

});
