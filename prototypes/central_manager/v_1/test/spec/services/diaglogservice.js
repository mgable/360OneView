'use strict';

describe('Service: Diaglogservice', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var Diaglogservice;
  beforeEach(inject(function (_Diaglogservice_) {
    Diaglogservice = _Diaglogservice_;
  }));

  it('should do something', function () {
    expect(!!Diaglogservice).toBe(true);
  });

});
