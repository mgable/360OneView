/* global xit, xdescribe */
'use strict';

xdescribe('Service: CubeService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var CubeService;
  beforeEach(inject(function (_CubeService_) {
    CubeService = _CubeService_;
  }));

  xit('should do something', function () {
    expect(!!CubeService).toBe(true);
  });

});
