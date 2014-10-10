'use strict';

describe('Service: GotoService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var GotoService;
  beforeEach(inject(function (_GotoService_) {
    GotoService = _GotoService_;
  }));

  it('should do something', function () {
    expect(!!GotoService).toBe(true);
  });

});
