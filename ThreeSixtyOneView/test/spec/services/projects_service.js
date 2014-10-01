'use strict';

describe('Service: ProjectsService', function () {

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

});