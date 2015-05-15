'use strict';

describe('Service: ManageScenariosService', function () {

	var ManageScenariosService, ManageScenariosModel, backend, manageScenariosUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageScenariosUrl = SERVER.server + CONFIG.application.api.scenarioElement;
		manageScenariosUrl = manageScenariosUrl.replace(/:id/, scenarioMockData.scenarioId);
		backend = $httpBackend;

		backend.when('GET', manageScenariosUrl + '/analysis-element').respond(scenarioMockData.scenarioElements);
		backend.when('GET', manageScenariosUrl + '/analysis-element' + '?cubeName=' + scenarioMockData.cubeName.replace(/ /, '+')).respond(scenarioMockData.scenarioElement);
		backend.when('GET', manageScenariosUrl + '/cube/' + scenarioMockData.cubeId + '/analysis-element').respond(scenarioMockData.scenarioElement);
		backend.when('PUT', manageScenariosUrl + '/cube/' + scenarioMockData.cubeId + '/analysis-element', {id: scenarioMockData.scenarioElement.id}).respond(scenarioMockData.scenarioElement);
		backend.when('POST', manageScenariosUrl + '/cube/' + scenarioMockData.cubeId + '/analysis-element' + '?source=' + scenarioMockData.scenarioElement.id,
			{name: scenarioMockData.scenarioElementModified.name, description: scenarioMockData.scenarioElementModified.description}).respond(scenarioMockData.scenarioElementModified);
	}));

	// Initialize the services
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

	describe('API calls', function() {
		afterEach(function() {
			backend.flush();
		});

		it('get list of scenario analysis elements for a scenario', function() {
			ManageScenariosService.get(scenarioMockData.scenarioId).then(function(response) {
				expect(response).toEqual(scenarioMockData.scenarioElements);
			});
		});

		it('get scenario analysis element using a cube id', function() {
			ManageScenariosService.getAnalysisElementByScenarioAndCube(scenarioMockData.scenarioId, scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(scenarioMockData.scenarioElement);
			});
		});

		it('get scenario analysis element using a cube name', function() {
			ManageScenariosService.getAnalysisElementByCubeName(scenarioMockData.scenarioId, scenarioMockData.cubeName).then(function(response) {
				expect(response).toEqual(scenarioMockData.scenarioElement);
			});
		});

		it('replace scenario analysis element for a cube', function() {
			ManageScenariosService.replaceAnalysisElementForCube(scenarioMockData.scenarioId, scenarioMockData.cubeId, scenarioMockData.scenarioElement.id).then(function(response) {
				expect(response).toEqual(scenarioMockData.scenarioElement);
			});
		});

		it('copy and replace scenario analysis element for a cube', function() {
			ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioMockData.scenarioId, scenarioMockData.cubeId, scenarioMockData.scenarioElement.id, {name: scenarioMockData.scenarioElementModified.name, description: scenarioMockData.scenarioElementModified.description}).then(function(response) {
				expect(response).toEqual(scenarioMockData.scenarioElementModified);
			});
		});
	});

});
