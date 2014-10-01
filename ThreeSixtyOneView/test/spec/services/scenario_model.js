/*jshint newcap: false */
'use strict';

describe('Service: ScenarioModel', function () {

    // load the service's module
  beforeEach(module('ThreeSixtyOneView.services'));
  beforeEach(module('ThreeSixtyOneView.config'));

  // instantiate service
  var ScenarioModel, CONFIG, SERVER, scenariosUrl, rootScope, data, resource, newScenario, deferred;
  beforeEach(inject(function ($rootScope, $q, _ScenarioModel_, _CONFIG_, _SERVER_, _Resource_) {
    ScenarioModel = _ScenarioModel_;
    CONFIG = _CONFIG_;
    SERVER = _SERVER_;
    scenariosUrl = SERVER.remote + CONFIG.application.api.scenarios;
    rootScope = $rootScope;
    data = {title: "title", isMaster: false, id: 1234, description: "this is a test"};
    resource = new _Resource_(scenariosUrl);
    newScenario = CONFIG.application.models.ScenarioModel.newScenario;
    deferred = $q.defer();
    deferred.resolve(data);
  }));

  it('should exist and define an API', function () {
    expect(!!ScenarioModel).toBe(true);
    expect(ScenarioModel.get).toBeDefined();
    expect(ScenarioModel.create).toBeDefined();
  });

  it ("should get a scenario", function(){
    spyOn(ScenarioModel.resource, "get").and.returnValue(deferred.promise);
    rootScope.$apply(ScenarioModel.get().then(function(response){
      expect(response).toEqual(data);
    }));
  });

  it("should create a scenario", function(){
    var resourceSpy = spyOn(ScenarioModel.resource, "create").and.callThrough();
    ScenarioModel.create(newScenario, "123");
    expect(resourceSpy).toHaveBeenCalledWith(newScenario, ScenarioModel.config, "123");
  });

});
