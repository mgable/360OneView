/* global xit */
/*jshint newcap: false */
'use strict';

describe('Service: ScenarioModel', function () {

    // load the service's module
  beforeEach(module('ThreeSixtyOneView.services'));
  beforeEach(module('ThreeSixtyOneView.config'));

  // instantiate service
  var ScenarioModel, rootScope, data, newScenario, deferred;
  beforeEach(inject(function ($rootScope, $q, _ScenarioModel_, CONFIG) {
    ScenarioModel = _ScenarioModel_;
    rootScope = $rootScope;
    data = {title: "title", isMaster: false, id: 1234, description: "this is a test"};
    newScenario = CONFIG.application.models.ScenarioModel.newScenario;
    deferred = $q.defer();
    deferred.resolve(data);
  }));

  it('should exist and define an API', function () {
    expect(ScenarioModel).toBeDefined();
    expect(ScenarioModel.create).toBeDefined();
  });

  xit ("should get a scenario", function(){
    spyOn(ScenarioModel.resource, "get").and.returnValue(deferred.promise);
    rootScope.$apply(ScenarioModel.get().then(function(response){
      expect(response).toEqual(data);
    }));
  });

  it("should create a scenario", function(){
    var resourceSpy = spyOn(ScenarioModel.resource, "create").and.callThrough();
    ScenarioModel.create({id:"123"}, newScenario);
    expect(resourceSpy).toHaveBeenCalledWith(newScenario, ScenarioModel.config, {id:"123"});
  });

});
