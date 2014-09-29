'use strict';

xdescribe('Service: Prototype', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var Prototype;
  beforeEach(inject(function (_Prototype_) {
    Prototype = _Prototype_;
  }));

  it('should do something', function () {
    expect(!!Prototype).toBe(true);
  });

});
