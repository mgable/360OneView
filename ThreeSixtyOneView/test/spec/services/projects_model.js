/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var $timeout, ProjectsModel, rootScope, projectsUrl, data, newProject, deferred;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView.config'));

	beforeEach(inject(function($q, $rootScope, $httpBackend, $location, _$timeout_, _ProjectsModel_, SERVER, CONFIG) {
		$timeout = _$timeout_;
		projectsUrl = SERVER.server + CONFIG.application.api.projects;
		ProjectsModel = _ProjectsModel_;
		rootScope = $rootScope;
		data = {title: "title", isMaster: false, id: 1234, description: "this is a test"};
		newProject = CONFIG.application.models.ProjectsModel.newProject;
		deferred = $q.defer();
		deferred.resolve(data);
		$httpBackend.expectPOST(projectsUrl).respond({
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
		var resourceSpy = spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
		ProjectsModel.find();
		expect(resourceSpy).toHaveBeenCalledWith(undefined, ProjectsModel.config);
	});

	it("should get all data", function(){
		spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
		ProjectsModel.find();
		rootScope.$apply(ProjectsModel.get().then(function(response){
			expect(response).toEqual(data);
		}));
	});

	it("should create a project", function (){
		var resourceSpy = spyOn(ProjectsModel.resource, "create").and.callThrough(),
		rootSpy = spyOn(rootScope, "$broadcast").and.callThrough();
		ProjectsModel.create(newProject);
		$timeout.flush();
		expect(resourceSpy).toHaveBeenCalledWith(newProject, ProjectsModel.config);
		expect(rootSpy.calls.count()).toEqual(2);
	});

	it ("should rename a project", function(){
		var resourceSpy = spyOn(ProjectsModel.resource, "put").and.returnValue(deferred.promise),
		data = {title: "new title", description: "new description", id: 12345, foo: "bar", bar: "foo"};
		ProjectsModel.rename(data);
		expect(resourceSpy).toHaveBeenCalledWith({title: "new title", description: "new description", id: 12345}, ProjectsModel.config);
	});
});