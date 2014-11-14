'use strict';

describe('Service: scenarioElementService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var scenarioElementService;
  beforeEach(inject(function (_ScenarioElementService_) {
    scenarioElementService = _ScenarioElementService_;
  }));

  it('should do something', function () {
    expect(!!scenarioElementService).toBe(true);
  });

});
