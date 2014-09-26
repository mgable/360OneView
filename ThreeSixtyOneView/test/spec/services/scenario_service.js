'use strict';

describe('Service: ScenarioService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ScenarioService;
  beforeEach(inject(function (_ScenarioService_) {
    ScenarioService = _ScenarioService_;
  }));

  it('should do something', function () {
    expect(!!ScenarioService).toBe(true);
  });

});
