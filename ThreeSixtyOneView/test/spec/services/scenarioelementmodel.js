'use strict';

describe('Service: scenarioElementModel', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var scenarioElementModel;
  beforeEach(inject(function (_ScenarioElementModel_) {
    scenarioElementModel = _ScenarioElementModel_;
  }));

  it('should do something', function () {
    expect(!!scenarioElementModel).toBe(true);
  });

});
