'use strict';

describe('Service: View Service', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ViewService;
  beforeEach(inject(function (_ViewService_) {
    ViewService = _ViewService_;
  }));

  it ("should be defined", function(){
    expect(ViewService).toBeDefined();
  });
});
