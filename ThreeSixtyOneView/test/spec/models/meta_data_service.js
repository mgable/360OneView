'use strict';

describe('Service: MetaDataService', function () {

	var MetaDataService, MetaDataModel, backend, metaDataUrl;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		metaDataUrl = SERVER.server + CONFIG.application.api.cube;
		metaDataUrl = metaDataUrl.replace(/:id/, scenarioMockData.cubeId);
		backend = $httpBackend;

		backend.when('GET', metaDataUrl + '/meta').respond(scenarioMockData.cubeMeta);
		backend.when('GET', metaDataUrl + '/dimension/' + scenarioMockData.dimensionId + '/hierarchy/' + scenarioMockData.hierarchyId + '/level/' + scenarioMockData.levelId + '/members?children=true').respond(scenarioMockData.levelMembers);
		backend.when('GET', metaDataUrl + '/analysis-element').respond(JSON.parse(scenarioMockData.cubeScenarioElements));
		backend.when('GET', metaDataUrl.replace(/\/3/, '') + '?editable=true&globals=false&prediction=' + scenarioMockData.cubeType).respond(JSON.parse(scenarioMockData.cubesList));
		_.each(JSON.parse(scenarioMockData.cubeMeta).dimensions, function(dimension) {
			_.each(dimension.hierarchies, function(hierarchy) {
				_.each(hierarchy.levels, function(level) {
					backend.when('GET', metaDataUrl + '/dimension/' + dimension.id + '/hierarchy/' + hierarchy.id + '/level/' + level.id + '/members?children=true')
						.respond(JSON.parse(scenarioMockData.allLevelMembers)[dimension.id + ',' + hierarchy.id + ',' + level.id]);
				})
			});
		});
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
			MetaDataService.getMeta(scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(MetaDataModel.metaConfig.transformResponse(scenarioMockData.cubeMeta));
			});
		});

		it('get level members', function() {
			MetaDataService.getLevelMembers(scenarioMockData.cubeId, scenarioMockData.dimensionId, scenarioMockData.hierarchyId, scenarioMockData.levelId, true).then(function(response) {
				expect(response).toEqual(scenarioMockData.levelMembers);
			});
		});

		it('build the dimension tree', function() {
			MetaDataService.buildDimensionsTree(scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.dimensionTree));
			});
		});

		it('get scenario analysis elements for a cube', function() {
			MetaDataService.getCubeAnalysisElements(scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.cubeScenarioElements));
			});
		});

		it('get list of cubes', function() {
			MetaDataService.getCubes(scenarioMockData.cubeType).then(function(response) {
				expect(response).toEqual(JSON.parse(scenarioMockData.cubesList));
			});
		});
	});
});
