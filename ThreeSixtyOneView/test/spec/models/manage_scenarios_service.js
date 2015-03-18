'use strict';

describe('Service: ManageScenariosService', function () {

	var ManageScenariosService, ManageScenariosModel, backend, manageScenariosUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageScenariosUrl = SERVER.server + CONFIG.application.api.scenarioElement;
		manageScenariosUrl = manageScenariosUrl.replace(/:id/, scenarioId);
		backend = $httpBackend;

		backend.when('GET', manageScenariosUrl + '/analysis-element').respond(scenarioElements);
		backend.when('GET', manageScenariosUrl + '/analysis-element' + '?cubeName=' + cubeName.replace(/ /, '+')).respond(scenarioElement);
		backend.when('GET', manageScenariosUrl + '/cube/' + cubeId + '/analysis-element').respond(scenarioElement);
		backend.when('PUT', manageScenariosUrl + '/cube/' + cubeId + '/analysis-element', {id: scenarioElement.id}).respond(scenarioElement);
		backend.when('POST', manageScenariosUrl + '/cube/' + cubeId + '/analysis-element' + '?source=' + scenarioElement.id,
			{name: scenarioElementModified.name, description: scenarioElementModified.description}).respond(scenarioElementModified);
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
			ManageScenariosService.get(scenarioId).then(function(response) {
				expect(response).toEqual(scenarioElements);
			});
		});

		it('get scenario analysis element using a cube id', function() {
			ManageScenariosService.getAnalysisElementByScenarioAndCube(scenarioId, cubeId).then(function(response) {
				expect(response).toEqual(scenarioElement);
			});
		});

		it('get scenario analysis element using a cube name', function() {
			ManageScenariosService.getAnalysisElementByCubeName(scenarioId, cubeName).then(function(response) {
				expect(response).toEqual(scenarioElement);
			});
		});

		it('replace scenario analysis element for a cube', function() {
			ManageScenariosService.replaceAnalysisElementForCube(scenarioId, cubeId, scenarioElement.id).then(function(response) {
				expect(response).toEqual(scenarioElement);
			});
		});

		it('copy and replace scenario analysis element for a cube', function() {
			ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, scenarioElement.id, {name: scenarioElementModified.name, description: scenarioElementModified.description}).then(function(response) {
				expect(response).toEqual(scenarioElementModified);
			});
		});
	});

});
