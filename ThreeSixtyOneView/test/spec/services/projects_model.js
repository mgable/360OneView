/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var $q, $timeout, $httpBackend, ProjectsModel, rootScope, projectsUrl, projectData, data, newProject, deferred, resourceSpy, EVENTS;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView.config'));

	beforeEach(inject(function(_$q_, $rootScope, _$httpBackend_, $location, _$timeout_, _ProjectsModel_, SERVER, CONFIG, _EVENTS_) {
		$q = _$q_;
		EVENTS = _EVENTS_;
		$timeout = _$timeout_;
		projectsUrl = SERVER.server + CONFIG.application.api.projects;
		ProjectsModel = _ProjectsModel_;
		rootScope = $rootScope;
		data = {data:{title: "new title", description: "new description", id: 12345}};
		projectData = {data: [data.data], item:data.data, original: data.data};
		newProject = CONFIG.application.models.ProjectsModel.newProject;
		deferred = $q.defer();
		deferred.resolve(projectData);
		$httpBackend = _$httpBackend_;
		resourceSpy = spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
	}));

	it("should exist and define an API", function(){
		expect(ProjectsModel).toBeDefined();
		expect(ProjectsModel.find).toBeDefined();
		expect(ProjectsModel.get).toBeDefined();
		expect(ProjectsModel.create).toBeDefined();
	});

	it("should find all data", function(){
		ProjectsModel.find();
		expect(resourceSpy).toHaveBeenCalledWith(undefined, ProjectsModel.config);
	});

	it("should get all data", function(){
		ProjectsModel.find();
		rootScope.$apply(ProjectsModel.get().then(function(response){
			expect(response).toEqual(projectData);
		}));
	});

	it("should create a project", function (){
		var resourceSpy = spyOn(ProjectsModel.resource, "create").and.callThrough(),
		rootSpy = spyOn(rootScope, "$broadcast").and.callThrough();
		$httpBackend.expectPOST(projectsUrl).respond({
            "doesnot": "matter"
        });

		ProjectsModel.create(newProject);
		$timeout.flush();
		expect(resourceSpy).toHaveBeenCalledWith(newProject, ProjectsModel.config);
		expect(rootSpy.calls.count()).toEqual(2);
	});

	it ("should rename a project", function(){
		var rootSpy = spyOn(rootScope, "$broadcast").and.callThrough(),
		deferred = $q.defer(),
		putSpy = spyOn(ProjectsModel.resource, "put").and.returnValue(deferred.promise);
		deferred.resolve(data);

		// prime the data
		ProjectsModel.find();
		$timeout.flush();

		rootSpy.calls.reset();
		ProjectsModel.rename(data.data);
		$timeout.flush();
		expect(putSpy).toHaveBeenCalledWith(data.data, ProjectsModel.config);
		expect(rootSpy.calls.argsFor(0)).toEqual([EVENTS.updateProjects, projectData]);
		// expect(rootSpy.calls.count()).toEqual(1);
	});
});