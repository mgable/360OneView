/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var $q, $timeout, $httpBackend, ProjectsService, ProjectsModel, rootScope, projectsUrl, projectData, data, newProject, deferred, resourceSpy, EVENTS;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView.config'));

	beforeEach(inject(function(_ProjectsService_, _$q_, $rootScope, _$httpBackend_, $location, _$timeout_, _ProjectsModel_, SERVER, CONFIG, _EVENTS_) {
		$q = _$q_;
		EVENTS = _EVENTS_;
		$timeout = _$timeout_;
		ProjectsService = _ProjectsService_;
		projectsUrl = SERVER.server + CONFIG.application.api.projects;
		ProjectsModel = _ProjectsModel_;
		rootScope = $rootScope;
		data = {title: "new title", description: "new description", id: 12345};
		projectData = {data: data , item:data , original: data};
		newProject = CONFIG.application.models.ProjectsModel.newProject;
		deferred = $q.defer();
		deferred.resolve(projectData);
		$httpBackend = _$httpBackend_;
		// resourceSpy = spyOn(ProjectsModel.resource, "get").and.returnValue(deferred.promise);
	}));

	it("should exist and define an API", function(){
		expect(ProjectsModel).toBeDefined();
		expect(ProjectsModel.put).toBeDefined();
		expect(ProjectsModel.rename).toBeDefined();
		expect(ProjectsModel.create).toBeDefined();
	});

	it("should create a project", function (){
		var resourceSpy = spyOn(ProjectsModel.resource, "create").and.returnValue(deferred.promise),
		rootSpy = spyOn(rootScope, "$broadcast").and.callThrough();
		$httpBackend.expectPOST(projectsUrl).respond({
            "doesnot": "matter"
        });

		ProjectsModel.create(newProject);
		$timeout.flush();
		expect(resourceSpy).toHaveBeenCalledWith(newProject, ProjectsModel.config);
		expect(rootSpy.calls.count()).toEqual(3);
	});

	it ("should rename a project", function(){
		var resourceSpy = spyOn(ProjectsModel.resource, "put").and.callThrough(),
		rootSpy = spyOn(rootScope, "$broadcast").and.returnValue(deferred.promise);
		$httpBackend.expectPUT(projectsUrl).respond({
            "doesnot": "matter"
        });

		ProjectsModel.rename(data);
		rootSpy.calls.reset();
		$timeout.flush();
		expect(resourceSpy).toHaveBeenCalledWith(data, ProjectsModel.config);
		//expect(rootSpy.calls.argsFor(2)).toEqual([EVENTS.updateProjects, projectData]);
		//expect(rootSpy.calls.count()).toEqual(1);
	});
});