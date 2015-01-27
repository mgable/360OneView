'use strict';

describe('Service: ScenarioService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

  // instantiate service
  var ScenarioService, ProjectsService, ScenarioModel, data, scenario, $q, $rootScope;
  beforeEach(inject(function(_$rootScope_, _$q_, _ScenarioService_, _ProjectsService_, _ScenarioModel_, _CONFIG_) {
    ScenarioService = _ScenarioService_;
    ProjectsService = _ProjectsService_;
    ScenarioModel = _ScenarioModel_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    data = [{title: "a", id: "1"},{title: "b", id: "2"},{title: "c", id: "3"}];
    scenario = _CONFIG_.application.models.ScenarioModel.newScenario;
  }));

  it('should exist and define an API', function () {
    expect(ScenarioService).toBeDefined();
    expect(ScenarioService.get).toBeDefined();
    expect(ScenarioService.getAll).toBeDefined();
  });

  it('should get all scenarios related to a project', function(){
    var deferred = $q.defer();
    deferred.resolve(data);
    var spy = spyOn(ScenarioService.resource, "get").and.returnValue(deferred.promise);
    ScenarioService.get("123", "345");
    expect(spy).toHaveBeenCalledWith({id: "123"}, {transformResponse: jasmine.any(Function), transformRequest: jasmine.any(Function)});
  });

  it('should get all scenarios', function(){
     var deferred = $q.defer();
    deferred.resolve(data);
    spyOn(ScenarioService, "get").and.returnValue(deferred.promise);
    spyOn(ProjectsService, "getProjects").and.returnValue([{id:"123", title:"title"}]);

    $rootScope.$apply(function(){
      ScenarioService.getAll().then(function(response){
        expect(ProjectsService.getProjects).toHaveBeenCalled();
        expect(response).toEqual([{title:'title', data:data}]);
      });
    });
    
  });

});