'use strict';

describe('Service: ManageTemplatesService', function () {

	var ManageTemplatesService, ManageTemplatesModel, backend, manageTemplatesUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageTemplatesUrl = SERVER.server + CONFIG.application.api.template;
		backend = $httpBackend;

		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'')).respond(JSON.parse(scenarioMockData.scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'') + '?type=' + scenarioMockData.templateType).respond(JSON.parse(scenarioMockData.scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '?extended=true').respond(JSON.parse(scenarioMockData.scenarioTemplates)[0]);
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ManageTemplatesService_) {
		ManageTemplatesService = _ManageTemplatesService_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(ManageTemplatesService.resource).toBeDefined();
	});

	describe('API calls', function() {
		afterEach(function() {
			backend.flush();
		});

		it('get list of all scenario templates', function() {
			ManageTemplatesService.getAll().then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.scenarioTemplates));
			});
		});

		it('get list of all scenario templates with a specific type', function() {
			ManageTemplatesService.getAll(scenarioMockData.templateType).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.scenarioTemplates));
			});
		});

		it('get a specific scenario template', function() {
			ManageTemplatesService.get(scenarioMockData.templateId).then(function(response) {
				var templates = JSON.parse(scenarioMockData.scenarioTemplates);
				expect(response).toEqual(templates[0]);
			});
		});
	});
});
