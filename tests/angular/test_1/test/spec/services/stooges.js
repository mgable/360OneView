'use strict';

describe('Service: stooges', function () {

  // load the service's module
  beforeEach(module('test1App'));

  // instantiate service
  var stooges;
  beforeEach(inject(function (_stooges_) {
    stooges = _stooges_;
  }));

  it('should do something', function () {
    expect(!!stooges).toBe(true);
  });

});
