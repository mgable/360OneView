'use strict';

describe('Service: MetaDataService', function () {

	var MetaDataService, MetaDataModel, backend, metaDataUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		metaDataUrl = SERVER.server + CONFIG.application.api.cube;
		metaDataUrl = metaDataUrl.replace(/:id/, cubeId);
		backend = $httpBackend;

		backend.when('GET', metaDataUrl + '/meta').respond(cubeMeta);
		backend.when('GET', metaDataUrl + '/dimension/' + dimensionId + '/hierarchy/' + hierarchyId + '/level/' + levelId + '/members?children=true').respond(levelMembers);
		backend.when('GET', metaDataUrl + '/analysis-element').respond(JSON.parse(cubeScenarioElements));
	}));

	// Initialize the services
	beforeEach(inject(function (_MetaDataService_, _MetaDataModel_) {
		MetaDataService = _MetaDataService_;
		MetaDataModel = _MetaDataModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(MetaDataService.resource).toBeDefined();
	});

	describe('API calls', function() {
		afterEach(function() {
			backend.flush();
		});

		it('get cube meta', function() {
			MetaDataService.getMeta(cubeId).then(function(response) {
				expect(response).toEqual(MetaDataModel.metaConfig.transformResponse(cubeMeta));
			});
		});

		it('get level members', function() {
			MetaDataService.getLevelMembers(cubeId, dimensionId, hierarchyId, levelId, true).then(function(response) {
				expect(response).toEqual(levelMembers);
			});
		});

		it('get scenario analysis elements for a cube', function() {
			MetaDataService.getCubeAnalysisElements(cubeId).then(function(response) {
				expect(response).toEqual(JSON.parse(cubeScenarioElements));
			});
		});
	});

});
