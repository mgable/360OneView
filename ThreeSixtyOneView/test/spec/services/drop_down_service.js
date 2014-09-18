'use strict';

describe('Drop Down Service', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView.services'));

  // instantiate service
  var DropdownService;
  beforeEach(inject(function (_DropdownService_) {
    DropdownService = _DropdownService_;
  }));

  it('should define an api', function () {
    expect(DropdownService.getActive).toBeDefined();
    expect(DropdownService.setActive).toBeDefined();
    expect(DropdownService.isActive).toBeDefined();
  });

  it('should set, get and check for isActive', function(){
    DropdownService.setActive("foo");
    expect(DropdownService.getActive()).toBe("foo");
    expect(DropdownService.isActive("foo")).toBe(true);
    expect(DropdownService.isActive("foox")).toBe(false);
  });

});
