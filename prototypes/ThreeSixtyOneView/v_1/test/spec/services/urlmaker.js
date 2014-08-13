'use strict';

describe('Service: Urlmaker', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var Urlmaker;
  beforeEach(inject(function (_Urlmaker_) {
    Urlmaker = _Urlmaker_;
  }));

  it('should do something', function () {
    expect(!!Urlmaker).toBe(true);
  });

});
