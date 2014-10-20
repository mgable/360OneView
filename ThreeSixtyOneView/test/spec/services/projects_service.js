'use strict';

xdescribe('Service: ProjectsService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ProjectsService, data;
  beforeEach(inject(function (_ProjectsService_) {
    ProjectsService = _ProjectsService_;
    data = [{title: "a", id: "1"},{title: "b", id: "2"},{title: "c", id: "3"}];
  }));

  it('should exist and define an API', function () {
    expect(ProjectsService).toBeDefined();
    expect(ProjectsService.getProjectIDByTitle).toBeDefined();
    expect(ProjectsService.setProjects).toBeDefined();
    expect(ProjectsService.getProjects).toBeDefined();
  });

  it("should get and set projects", function(){
    ProjectsService.setProjects(data);
    expect(ProjectsService.getProjects()).toBe(data);
  });

  it ("should get project id by title", function(){
    ProjectsService.setProjects(data);
    expect(ProjectsService.getProjectIDByTitle("a")).toEqual("1");
    expect(ProjectsService.getProjectIDByTitle("b")).toEqual("2");
    expect(ProjectsService.getProjectIDByTitle("c")).toEqual("3");
  });

  xit ("should rename a project", function(){
    var resourceSpy = spyOn(ProjectsModel.resource, "put").and.callThrough(),
    rootSpy = spyOn(rootScope, "$broadcast").and.returnValue(deferred.promise);
    $httpBackend.expectPUT(projectsUrl).respond({
            "doesnot": "matter"
        });
    rootSpy.calls.reset();
    
    ProjectsModel.rename(data);

    $timeout.flush();
    expect(resourceSpy).toHaveBeenCalledWith(data, ProjectsModel.config);
    //expect(rootSpy.calls.argsFor(2)).toEqual([EVENTS.updateProjects, projectData]);
    //expect(rootSpy.calls.count()).toEqual(1);
  });

});