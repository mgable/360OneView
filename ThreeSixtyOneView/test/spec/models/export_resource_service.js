'use strict';

describe('Service: ExportResourceService', function () {

	var ExportResourceService, ExportResourceModel, backend, exportUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		exportUrl = SERVER.server + CONFIG.application.api.exportResource;
		exportUrl = exportUrl.replace(/:elementId/, scenarioMockData.elementId);
		backend = $httpBackend;

		backend.when('POST', exportUrl, scenarioMockData.views[scenarioMockData.views.length - 1]).respond({'status': 'EXPORT_REQUEST_ACCEPTED'});
		backend.when('GET', exportUrl + '/status').respond({'status': 'COMPLETED'});
		backend.when('GET', exportUrl + '/download').respond(exportUrl + '/download');
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_ExportResourceService_, _ExportResourceModel_) {
		ExportResourceService = _ExportResourceService_;
		ExportResourceModel = _ExportResourceModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(ExportResourceService.resource).toBeDefined();
	});

	it('request an export', function() {
		ExportResourceService.requestExport(scenarioMockData.elementId, scenarioMockData.views[scenarioMockData.views.length - 1]).then(function(response) {
			expect(response.status).toBe('EXPORT_REQUEST_ACCEPTED');
		});
		backend.flush();
	});

	it('check the export status', function() {
		ExportResourceService.checkStatus(scenarioMockData.elementId).then(function(response) {
			expect(response.status).toBe('COMPLETED');
		});
		backend.flush();
	});

	it('download the file', function() {
		ExportResourceService.downloadFile(scenarioMockData.elementId).then(function(response) {
			expect(response).toBe(exportUrl + '/download');
		});
		backend.flush();
	});
});
