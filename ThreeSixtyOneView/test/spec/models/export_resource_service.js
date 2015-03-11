'use strict';

describe('Service: ExportResourceService', function () {

	var ExportResourceService, ExportResourceModel, backend, exportUrl,
		elementId = 23;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		exportUrl = SERVER.server + CONFIG.application.api.exportResource;
		exportUrl = exportUrl.replace(/:elementId/, elementId);
		backend = $httpBackend;

		backend.when('GET', exportUrl + '/status').respond({'status': 'success'});
		backend.when('GET', exportUrl + '/download').respond(exportUrl + '/download');
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_ExportResourceService_, _ExportResourceModel_, $httpBackend) {
		ExportResourceService = _ExportResourceService_;
		ExportResourceModel = _ExportResourceModel_;

		// backend.flush();
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ExportResourceService.resource).toBeDefined();
	});

	it('check the export status', function() {
		ExportResourceService.checkStatus(elementId).then(function(response) {
			expect(response.status).toBe('success');
		});
		backend.flush();
		backend.verifyNoOutstandingExpectation();
	});

	it('download the file', function() {
		ExportResourceService.downloadFile(elementId).then(function(response) {
			expect(response).toBe(exportUrl + '/download');
		});
		backend.flush();
		backend.verifyNoOutstandingExpectation();
	});
});
