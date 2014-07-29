'use strict';

describe('Service: Favoritesservice', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var Favoritesservice;
  beforeEach(inject(function (_Favoritesservice_) {
    Favoritesservice = _Favoritesservice_;
  }));

  it('should do something', function () {
    expect(!!Favoritesservice).toBe(true);
  });

});
