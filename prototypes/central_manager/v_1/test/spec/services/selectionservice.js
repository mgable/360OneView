'use strict';

describe('Service: selectionService', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var selectionService;
  beforeEach(inject(function (_selectionService_) {
    selectionService = _selectionService_;
  }));

  it('should do something', function () {
    expect(!!selectionService).toBe(true);
  });

});
