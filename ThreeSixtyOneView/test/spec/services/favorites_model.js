/*jshint newcap: false */
'use strict';

describe('Service: FavoritesModel', function() {
	var FavoritesModel, rootScope, $httpBackend, url, projectUrl, data;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function(_$httpBackend_, $location, $rootScope, _FavoritesModel_, SERVER, CONFIG) {
		url = SERVER.server + CONFIG.application.api.favorites;
		projectUrl = SERVER.server + CONFIG.application.api.projects;
		FavoritesModel = _FavoritesModel_;
		$httpBackend = _$httpBackend_;
		spyOn($location, "host").and.returnValue("SERVER.server");
		rootScope = $rootScope;
		data = [ {
			"uuid" : "70091b27e3b95079172f4f29757eb0a7"
		}, {
			"uuid" : "c9ca31205c4216bb69b57c0fb4edb644"
		}, {
			"uuid" : "d62bf05b50946c86364e78aa46595313"
		} ];

		$httpBackend.whenGET(url).respond(data);
		$httpBackend.whenGET(projectUrl).respond({"doesnot":"matter"});
	}));

	it("should exist and define an API", function(){
		expect(FavoritesModel).toBeDefined();
		expect(FavoritesModel.find).toBeDefined();
		expect(FavoritesModel.get).toBeDefined();
		expect(FavoritesModel.setAsFavorite).toBeDefined();
	});

	it ("should find all data", function(){
		$httpBackend.expectGET(url).respond(data);
		$httpBackend.verifyNoOutstandingExpectation();
	});

	it ("should set as favorite", function(){
		$httpBackend.expectPOST(url).respond({"status": "204"});
		FavoritesModel.setAsFavorite("123");
		$httpBackend.flush();
		$httpBackend.verifyNoOutstandingExpectation();
	});

	it("should get all data", function(){
		var result;
		rootScope.$apply( FavoritesModel.get().then(function(response){
			result = response;
		}));

		$httpBackend.flush();
		expect(result).toEqual(data);
	});
});