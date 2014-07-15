'use strict';

describe('Service: ActiveSelection', function () {

  // load the service's module
  beforeEach(module('centralManagerApp'));

  // instantiate service
  var ActiveSelection;
  beforeEach(inject(function (_ActiveSelection_) {
    ActiveSelection = _ActiveSelection_;
  }));

  it('should do something', function () {
    expect(!!ActiveSelection).toBe(true);
  });

});
