/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var ProjectsModel, resource, resourceSpy, rootScope, $httpBackend, url, favoritesUrl, data;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function(_$httpBackend_, $rootScope, _ProjectsModel_, _Resource_, SERVER, CONFIG) {
		url = SERVER.remote + CONFIG.application.api.projects;
		favoritesUrl = SERVER.remote + CONFIG.application.api.favorites;
		ProjectsModel = _ProjectsModel_;
		$httpBackend = _$httpBackend_;
		resource = new _Resource_(url);
		resourceSpy = spyOn(resource, "get").and.returnValue({foo:"bar"});
		rootScope = $rootScope;

		data = [ {
			"uuid" : "70091b27e3b95079172f4f29757eb0a7"
		}, {
			"uuid" : "c9ca31205c4216bb69b57c0fb4edb644"
		}, {
			"uuid" : "d62bf05b50946c86364e78aa46595313"
		} ];

		$httpBackend.whenGET(favoritesUrl).respond({
			"doesnot": "matter"
		});
	}));

	it("should exist and define an API", function(){
		expect(ProjectsModel).toBeDefined();
		expect(ProjectsModel.find).toBeDefined();
		expect(ProjectsModel.get).toBeDefined();
		expect(ProjectsModel.create).toBeDefined();
	});

	it("should find all data", function(){
		$httpBackend.expectGET(url).respond(data);
		$httpBackend.verifyNoOutstandingExpectation();
	});

	it("should get all data", function(){
		var result;
		$httpBackend.expectGET(url).respond({data:data});

		rootScope.$apply(ProjectsModel.get().then(function(response){
			result = response;
		}));

		$httpBackend.flush();
		$httpBackend.verifyNoOutstandingExpectation();
	});
});