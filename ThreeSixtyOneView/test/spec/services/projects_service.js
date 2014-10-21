/* global xit, xdescribe */
'use strict';

describe('Service: ProjectsService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ProjectsService, data, ProjectsModel
  beforeEach(inject(function (_ProjectsService_, _ProjectsModel_) {
    ProjectsService = _ProjectsService_;
    ProjectsModel = _ProjectsModel_;
    data = [{title: "a", id: "1", description:"this is a"},{title: "b", id: "2", description:"this is b"},{title: "c", id: "3", description:"this is c"}];
  }));

  it('should exist and define an API', function () {
    expect(ProjectsService).toBeDefined();
    expect(ProjectsService.getProjectItemById ).toBeDefined();
    expect(ProjectsService.rename).toBeDefined();
    expect(ProjectsService.getProjects).toBeDefined();
  });

  it("should get all data", function(){
    ProjectsService.data = data
    expect(ProjectsService.getProjects()).toBe(data);
  });

  it ("should get project item by id", function(){
    ProjectsService.data = data;
    expect(ProjectsService.getProjectItemById("1")).toEqual(data[0]);
    expect(ProjectsService.getProjectItemById("2")).toEqual(data[1]);
    expect(ProjectsService.getProjectItemById("3")).toEqual(data[2]);
  });

  xit ("should rename a project", function(){
    var resourceSpy = jasmine.createSpy(ProjectsModel, "put");
    console.info(ProjectsService.put);
    ProjectsService.rename(data);
    expect(resourceSpy).toHaveBeenCalledWith("foo");
  });

   //   this.rename = function(data){
  //           var obj = (_.pick(data, 'title', 'description', 'id'));
  //           if (typeof obj.description === "undefined"){
  //               obj.description = "";
  //           }
  //           this.put(obj);

  //       };

});