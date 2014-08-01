'use strict';

describe('Service: Viewservice', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var Viewservice;
  beforeEach(inject(function (_Viewservice_) {
    Viewservice = _Viewservice_;
  }));

  it('should do something', function () {
    expect(!!Viewservice).toBe(true);
  });

});
