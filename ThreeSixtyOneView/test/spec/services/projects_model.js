/*jshint newcap: false */
'use strict';

describe('Service: ProjectModel', function() {
	var $q, $timeout, $httpBackend, ProjectsModel, rootScope, projectsUrl, data, newProject, deferred, resourceSpy;

	// load the service's module
	beforeEach(module('ThreeSixtyOneView.services'));
	beforeEach(module('ThreeSixtyOneView.config'));

	beforeEach(inject(function(_$q_, $rootScope, _$httpBackend_, $location, _$timeout_, _ProjectsModel_, SERVER, CONFIG) {
		$q = _$q_;
		$timeout = _$timeout_;
		projectsUrl = SERVER.server + CONFIG.application.api.projects;
		ProjectsModel = _ProjectsModel_;
		rootScope = $rootScope;
		data = {data: [{title: "title", isMaster: false, id: 1234, description: "this is a test"}]};
		newProject = CONFIG.application.models.ProjectsModel.newProject;
		deferred = $q.defer();
		deferred.resolve(data);
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
			expect(response).toEqual(data);
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
		data = {data: {title: "new title", description: "new description", id: 12345, "foo": "bar", "bar": "foo"}},
		deferred = $q.defer(),
		putSpy = spyOn(ProjectsModel.resource, "put").and.returnValue(deferred.promise);
		deferred.resolve(data);

		ProjectsModel.find();
		$timeout.flush();

		rootScope.$apply(ProjectsModel.get().then(function(){
			ProjectsModel.rename(data.data);
			expect(putSpy).toHaveBeenCalledWith({title: "new title", description: "new description", id: 12345}, ProjectsModel.config);
			expect(rootSpy.calls.count()).toEqual(2);
		}));
	});
});