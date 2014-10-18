'use strict';

describe('Service: Active Selection', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ActiveSelection, item, rootScopeSpy, EVENTS;
  beforeEach(inject(function ($rootScope, _ActiveSelection_, _EVENTS_) {
    ActiveSelection = _ActiveSelection_;
    EVENTS = _EVENTS_;
    item = {"id": "123"};
    rootScopeSpy = spyOn($rootScope, "$broadcast").and.callThrough();
  }));

  it('should de defined', function () {
    expect(ActiveSelection).toBeDefined();
  });

  it('should define an API', function(){
    expect(ActiveSelection.isActiveItem).toBeDefined();
    expect(ActiveSelection.setActiveItem).toBeDefined();
    expect(ActiveSelection.getActiveItem).toBeDefined();
    expect(ActiveSelection.activeItem).toBeDefined();
    expect(ActiveSelection.clearActiveItem).toBeDefined();
    expect(ActiveSelection.setRadio).toBeDefined();
  });


  it("should get and set the active selection", function(){
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(true);
    expect(ActiveSelection.isActiveItem({"should-be": "false"})).toBe(false);
  });

  it("should clear the active selection", function(){
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(true);
    ActiveSelection.clearActiveItem();
    expect(ActiveSelection.isActiveItem(item)).toBe(false);
  });

  it("should know if there is an active selection", function(){
    expect(ActiveSelection.activeItem()).toBe(false);
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.activeItem()).toBe(true);
  });

  it("should broadcast when an active selection is set", function(){
    ActiveSelection.setActiveItem(item);
    expect(rootScopeSpy).toHaveBeenCalledWith(EVENTS.changeActiveItem, item);
  });

  it("should set the radio property", function(){
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(true);
    ActiveSelection.setRadio(false);
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(false);
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(true);
  });

});