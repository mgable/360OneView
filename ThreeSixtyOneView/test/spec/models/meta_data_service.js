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
		backend.when('GET', metaDataUrl.replace(/\/3/, '') + '?editable=true&globals=false&prediction=' + cubeType).respond(JSON.parse(cubesList));
		_.each(JSON.parse(cubeMeta).dimensions, function(dimension) {
			_.each(dimension.hierarchies, function(hierarchy) {
				_.each(hierarchy.levels, function(level) {
					backend.when('GET', metaDataUrl + '/dimension/' + dimension.id + '/hierarchy/' + hierarchy.id + '/level/' + level.id + '/members?children=true')
						.respond(JSON.parse(allLevelMembers)[dimension.id + ',' + hierarchy.id + ',' + level.id]);
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
			MetaDataService.getMeta(cubeId).then(function(response) {
				expect(response).toEqual(MetaDataModel.metaConfig.transformResponse(cubeMeta));
			});
		});

		it('get level members', function() {
			MetaDataService.getLevelMembers(cubeId, dimensionId, hierarchyId, levelId, true).then(function(response) {
				expect(response).toEqual(levelMembers);
			});
		});

		it('build the dimension tree', function() {
			MetaDataService.buildDimensionsTree(cubeId).then(function(response) {
				expect(response).toEqual(JSON.parse(dimensionTree));
			});
		});

		it('get scenario analysis elements for a cube', function() {
			MetaDataService.getCubeAnalysisElements(cubeId).then(function(response) {
				expect(response).toEqual(JSON.parse(cubeScenarioElements));
			});
		});

		it('get list of cubes', function() {
			MetaDataService.getCubes(cubeType).then(function(response) {
				expect(response).toEqual(JSON.parse(cubesList));
			});
		});
	});
});
