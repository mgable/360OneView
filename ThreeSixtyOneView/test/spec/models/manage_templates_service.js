'use strict';

describe('Service: ManageTemplatesService', function () {

	var ManageTemplatesService, ManageTemplatesModel, backend, manageTemplatesUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageTemplatesUrl = SERVER.server + CONFIG.application.api.template;
		backend = $httpBackend;

		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'')).respond(JSON.parse(scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'') + '?type=' + templateType).respond(JSON.parse(scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, templateId) + '?extended=true').respond(JSON.parse(scenarioTemplates)[0]);
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
				expect(response).toEqual(JSON.parse(scenarioTemplates));
			});
		});

		it('get list of all scenario templates with a specific type', function() {
			ManageTemplatesService.getAll(templateType).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioTemplates));
			});
		});

		it('get a specific scenario template', function() {
			ManageTemplatesService.get(templateId).then(function(response) {
				var templates = JSON.parse(scenarioTemplates);
				expect(response).toEqual(templates[0]);
			});
		});
	});
});
