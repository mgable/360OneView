/* global xit */
'use strict';

describe('Service: ProjectsService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ProjectsService, data, ProjectsModel;
  beforeEach(inject(function (_ProjectsService_, _ProjectsModel_) {
    ProjectsService = _ProjectsService_;
    ProjectsModel = _ProjectsModel_;
    data = [{name: "a", uuid: "1", description:"this is a"},{name: "b", uuid: "2"},{name: "c", uuid: "3", description:"this is c"}];
  }));

  it('should exist and define an API', function () {
    expect(ProjectsService).toBeDefined();
    expect(ProjectsService.getProjectItemById ).toBeDefined();
    expect(ProjectsService.rename).toBeDefined();
    expect(ProjectsService.getProjects).toBeDefined();
  });

  it("should get all data", function(){
    ProjectsService.data = data;
    expect(ProjectsService.getProjects()).toBe(data);
  });

  it ("should get project item by uuid", function(){
    ProjectsService.data = data;
    expect(ProjectsService.getProjectItemById("1")).toEqual(data[0]);
    expect(ProjectsService.getProjectItemById("2")).toEqual(data[1]);
    expect(ProjectsService.getProjectItemById("3")).toEqual(data[2]);
  });

  it ("should rename a project", function(){
    var resourceSpy = spyOn(ProjectsService, "put");
    ProjectsService.rename(data[0]);
    expect(resourceSpy).toHaveBeenCalledWith(data[0]);
    ProjectsService.rename(data[1]);
    expect(resourceSpy).toHaveBeenCalledWith({name: "b", uuid: "2", description: ""});
  });

});