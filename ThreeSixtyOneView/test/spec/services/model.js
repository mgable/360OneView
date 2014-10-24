/* global xit, xdescribe */
'use strict';

xdescribe('Service: Model', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var Model;
  beforeEach(inject(function (_Model_) {
    Model = _Model_;
  }));

  xit('should do something', function () {
    expect(!!Model).toBe(true);
  });

});
