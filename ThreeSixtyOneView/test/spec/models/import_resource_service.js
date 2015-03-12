'use strict';

describe('Service: ImportResourceService', function () {

	var ImportResourceService, ExportResourceModel, backend, importUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		importUrl = SERVER.server + CONFIG.application.api.importResource;
		importUrl = importUrl.replace(/:elementId/, elementId);
		backend = $httpBackend;

		backend.when('POST', importUrl + '/upload', new FormData()).respond({'status': 'IMPORT_REQUEST_ACCEPTED'});
		backend.when('GET', importUrl + '/status').respond({'status': 'COMPLETED'});
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_ImportResourceService_, _ImportResourceModel_) {
		ImportResourceService = _ImportResourceService_;
		ExportResourceModel = _ImportResourceModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(ImportResourceService.resource).toBeDefined();
	});

	it('check the import status', function() {
		ImportResourceService.uploadFile(elementId, 'testFile').then(function(response) {
			expect(response.status).toBe('IMPORT_REQUEST_ACCEPTED');
		});
		backend.flush();
	});

	it('check the import status', function() {
		ImportResourceService.checkStatus(elementId).then(function(response) {
			expect(response.status).toBe('COMPLETED');
		});
		backend.flush();
	});
});
