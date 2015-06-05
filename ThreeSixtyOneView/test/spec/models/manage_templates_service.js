'use strict';

describe('Service: ManageTemplatesService', function () {

	var ManageTemplatesService, ManageTemplatesModel, backend, manageTemplatesUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageTemplatesUrl = SERVER.server + CONFIG.application.api.template;
		backend = $httpBackend;

		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'')).respond(JSON.parse(scenarioMockData.scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/\/:templateId/,'') + '?type=' + scenarioMockData.templateType).respond(JSON.parse(scenarioMockData.scenarioTemplates));
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '?extended=true').respond(JSON.parse(scenarioMockData.scenarioTemplates)[0]);
		backend.when('POST', manageTemplatesUrl.replace(/\/:templateId/,'')).respond(JSON.parse(templateMockData.baseTemplate));
		backend.when('PUT', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId)).respond(JSON.parse(templateMockData.baseTemplate));
		backend.when('PUT', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '?commit=true').respond(JSON.parse(templateMockData.baseTemplate));
		backend.when('DELETE', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId)).respond(JSON.parse(templateMockData.baseTemplate));
		backend.when('POST', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/views').respond(JSON.parse(scenarioMockData.touchpointView));
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/cube/id?cubeName=touchpoint').respond([1]);
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/cube/ids?type=Standard').respond([1,2,3]);
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/dimension/1/hierarchy').respond([1,2,3]);
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/dimension/1/hierarchy/2/level/3/members?children=true').respond([1,2,3]);
		backend.when('GET', manageTemplatesUrl.replace(/:templateId/, scenarioMockData.templateId) + '/kpis').respond([1,2,3]);
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

		it('should create a draft scenario template', function() {
			ManageTemplatesService.create(JSON.parse(templateMockData.baseTemplate)).then(function(response) {
				expect(response).toEqual(JSON.parse(templateMockData.baseTemplate));
			});
		});

		it('should update the draft scenario template', function() {
			ManageTemplatesService.update(JSON.parse(templateMockData.baseTemplate), false).then(function(response) {
				expect(response).toEqual(JSON.parse(templateMockData.baseTemplate));
			});
		});

		it('should commit the changes to the draft scenario template and make it final', function() {
			ManageTemplatesService.update(JSON.parse(templateMockData.baseTemplate), true).then(function(response) {
				expect(response).toEqual(JSON.parse(templateMockData.baseTemplate));
			});
		});

		it('should delete a draft scenario template', function() {
			ManageTemplatesService.delete(templateMockData.templateId).then(function() {
				expect(ManageTemplatesService.kpis).toEqual([]);
				expect(ManageTemplatesService.dimensions).toEqual([]);
			});
		});

		it('should create the default views for the created scenario template', function() {
			ManageTemplatesService.createView(scenarioMockData.templateId, JSON.parse(scenarioMockData.touchpointView)).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.touchpointView));
			});
		});

		it('should get a cube in a scenario template by its name', function() {
			ManageTemplatesService.getTemplateCubeByName(scenarioMockData.templateId, 'touchpoint').then(function(response) {
				expect(response).toEqual([1]);
			});
		});

		it('should get cubes in a scenario template by their type', function() {
			ManageTemplatesService.getTemplateCubesByType(scenarioMockData.templateId, 'Standard').then(function(response) {
				expect(response).toEqual([1,2,3]);
			});
		});

		it('should get hierarchies in a dimension in scenario template', function() {
			ManageTemplatesService.getHierarchy(templateMockData.templateId, 1).then(function(response) {
				expect(response).toEqual([1,2,3]);
			});
		});

		it('should get members in a level in a dimension in scenario template', function() {
			ManageTemplatesService.getMembers(templateMockData.templateId, 1, 2, 3).then(function(response) {
				expect(response).toEqual([1,2,3]);
			});
		});

		it('should get all the selected kpis in a scenario template', function() {
			ManageTemplatesService.getAllKpis(templateMockData.templateId).then(function(response) {
				expect(response).toEqual([1,2,3]);
			});
		});
	});

	it('should get the kpis list', function() {
		ManageTemplatesService.kpis = ['a'];
		expect(ManageTemplatesService.getKpis()).toEqual(['a']);
	});

	it('should get the dimensions list', function() {
		ManageTemplatesService.dimensions = ['a'];
		expect(ManageTemplatesService.getDimensions()).toEqual(['a']);
	});
});
