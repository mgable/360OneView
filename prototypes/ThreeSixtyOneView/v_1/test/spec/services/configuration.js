'use strict';

xdescribe('Service: configuration', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var configuration;
  beforeEach(inject(function (_configuration_) {
    configuration = _configuration_;
  }));

  it('should do something', function () {
    expect(!!configuration).toBe(true);
  });

});
