/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var ProjectsModel, resource,  rootScope, projectsUrl, favoritesUrl, data, newProject, deferred, CONFIG, SERVER;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView.config'));

	beforeEach(inject(function($q, $rootScope, $location,  _ProjectsModel_, _Resource_, _SERVER_, _CONFIG_) {
		CONFIG = _CONFIG_;
		SERVER = _SERVER_;
		projectsUrl = SERVER.remote + CONFIG.application.api.projects;
		favoritesUrl = SERVER.remote + CONFIG.application.api.favorites;
		ProjectsModel = _ProjectsModel_;
		rootScope = $rootScope;
		data = {title: "title", isMaster: false, id: 1234, description: "this is a test"};
		resource = new _Resource_(projectsUrl);
		newProject = CONFIG.view.ProjectManager.newProject;
		deferred = $q.defer();
		deferred.resolve(data);
	}));

	it("should exist and define an API", function(){
		expect(ProjectsModel).toBeDefined();
		expect(ProjectsModel.find).toBeDefined();
		expect(ProjectsModel.get).toBeDefined();
		expect(ProjectsModel.create).toBeDefined();
	});

	it("should find all data", function(){
		var resourceSpy = spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
		ProjectsModel.find();
		expect(resourceSpy).toHaveBeenCalledWith(undefined, ProjectsModel.config);
	});

	it("should get all data", function(){
		spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
		ProjectsModel.find();
		ProjectsModel.get().then(function(response){
			expect(response).toEqual(data);
		});
	});

	it("should create a project", function (){
		var resourceSpy = spyOn(ProjectsModel.resource, "create").and.callThrough();
		ProjectsModel.create(newProject);
		expect(resourceSpy).toHaveBeenCalledWith(newProject, ProjectsModel.config);
	});

	it ("should rename a project", function(){
		var resourceSpy = spyOn(ProjectsModel.resource, "put").and.returnValue(deferred.promise),
		data = {title: "new title", description: "new description", id: 12345, foo: "bar", bar: "foo"};
		ProjectsModel.rename(data);
		expect(resourceSpy).toHaveBeenCalledWith({title: "new title", description: "new description", id: 12345}, ProjectsModel.config);
	});
});