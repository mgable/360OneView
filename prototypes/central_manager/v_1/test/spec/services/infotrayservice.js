'use strict';

describe('Service: Infotrayservice', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var Infotrayservice;
  beforeEach(inject(function (_Infotrayservice_) {
    Infotrayservice = _Infotrayservice_;
  }));

  it('should do something', function () {
    expect(!!Infotrayservice).toBe(true);
  });

});
