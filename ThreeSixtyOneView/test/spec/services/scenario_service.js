/* global _ */
'use strict';

describe('Service: ScenarioService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ScenarioService, ProjectsService, ScenarioModel, data, scenario;
  beforeEach(inject(function (_ScenarioService_, _ProjectsService_, _ScenarioModel_, _CONFIG_) {
    ScenarioService = _ScenarioService_;
    ProjectsService = _ProjectsService_;
    ScenarioModel = _ScenarioModel_;
    data = [{title: "a", id: "1"},{title: "b", id: "2"},{title: "c", id: "3"}];
    ProjectsService.setProjects(data);
    scenario = _CONFIG_.application.models.ScenarioModel.newScenario;
  }));

  it('should exist and define an API', function () {
    expect(ScenarioService).toBeDefined();
    expect(ScenarioService.get).toBeDefined();
    expect(ScenarioService.create).toBeDefined();
  });

  it('should get all scenarios related to a project', function(){
    var spy = spyOn(ScenarioModel, "get");
    ScenarioService.get("a");
    expect(spy).toHaveBeenCalledWith("1");
  });

  it('should create a new scenario', function(){
    var spy = spyOn(ScenarioModel, "create"),
    scenarioObj = {
      title: "foo",
      projectName: "a",
      description: "foobarfuzz",
      projectId: "1"
    };
    ScenarioService.create(scenarioObj);
    _.extend(scenario, scenarioObj);
    expect(spy).toHaveBeenCalledWith(scenario, '1');
  });

});


//     this.create = function(scenarioObj){
//       var id = ProjectsService.getProjectIDByTitle(scenarioObj.project);
//       scenario.name = scenarioObj.title;
//       scenario.description = scenarioObj.description || "";
//       ScenarioModel.create(scenario, id);
//     };