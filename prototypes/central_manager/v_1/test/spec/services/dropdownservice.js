'use strict';

describe('Service: DropDownService', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var DropDownService;
  beforeEach(inject(function (_DropDownService_) {
    DropDownService = _DropDownService_;
  }));

  it('should do something', function () {
    expect(!!DropDownService).toBe(true);
  });

});
