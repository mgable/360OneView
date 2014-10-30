'use strict';

describe('Service: GotoService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var GotoService, $state, projectId, scenarioId;
  beforeEach(inject(function (_GotoService_, _$state_) {
    GotoService = _GotoService_;
    $state = _$state_;
    projectId = 1;
    scenarioId = 2;
    spyOn($state, "go");
  }));

  it('should be defined', function () {
    expect(!!GotoService).toBe(true);
  });

  it('should define an API', function(){
    expect(GotoService.scenarioEdit).toBeDefined();
    expect(GotoService.dashboard).toBeDefined();
    expect(GotoService.projects).toBeDefined();
    expect(GotoService.scenarioCreate).toBeDefined();
  });

  it('should go to Scenario Edit', function(){
    GotoService.scenarioEdit(projectId, scenarioId);
    expect($state.go).toHaveBeenCalledWith("Scenario.edit", {projectId:projectId, scenarioId:scenarioId});
  });

  it('should go to Scenario Create', function(){
    GotoService.scenarioCreate(projectId, scenarioId);
    expect($state.go).toHaveBeenCalledWith("ScenarioCreate", {projectId:projectId});
  });

  it('should go to Project Listing', function(){
    GotoService.projects();
    expect($state.go).toHaveBeenCalledWith("ProjectManager");
  });

  it('should go to Project Dashboard', function(){
    GotoService.dashboard(projectId);
    expect($state.go).toHaveBeenCalledWith("Dashboard", {projectId:projectId});
  });


});