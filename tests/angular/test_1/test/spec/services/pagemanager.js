'use strict';

describe('Service: Pagemanager', function () {

  // load the service's module
  beforeEach(module('test1App'));

  // instantiate service
  var Pagemanager;
  beforeEach(inject(function (_Pagemanager_) {
    Pagemanager = _Pagemanager_;
  }));

  it('should do something', function () {
    expect(!!Pagemanager).toBe(true);
  });

});
