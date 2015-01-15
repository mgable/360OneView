'use strict';

describe('Service: PivotMetaService', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var PivotMetaService;
  beforeEach(inject(function (_PivotMetaService_) {
    PivotMetaService = _PivotMetaService_;
  }));

  it('should do something', function () {
    expect(!!PivotMetaService).toBe(true);
  });

});
