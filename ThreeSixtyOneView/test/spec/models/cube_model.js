/* global xit, xdescribe */

'use strict';

xdescribe('Service: CubeModel', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var CubeModel;
  beforeEach(inject(function (_CubeModel_) {
    CubeModel = _CubeModel_;
  }));

  xit('should do something', function () {
    expect(!!CubeModel).toBe(true);
  });

});
