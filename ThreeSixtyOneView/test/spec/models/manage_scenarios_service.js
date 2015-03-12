'use strict';

describe('Service: ManageScenariosService', function () {

	var ManageScenariosService, ManageScenariosModel, backend, manageScenariosUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageScenariosUrl = SERVER.server + CONFIG.application.api.scenarioElement;
		manageScenariosUrl = manageScenariosUrl.replace(/:elementId/, elementId);
		backend = $httpBackend;

		// backend.when('POST', manageScenariosUrl + '/upload', new FormData()).respond({'status': 'IMPORT_REQUEST_ACCEPTED'});
		// backend.when('GET', manageScenariosUrl + '/status').respond({'status': 'COMPLETED'});
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_ManageScenariosService_, _ManageScenariosModel_) {
		ManageScenariosService = _ManageScenariosService_;
		ManageScenariosModel = _ManageScenariosModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(ManageScenariosService.resource).toBeDefined();
	});
});
