'use strict';

describe('Service: Active Selection', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ActiveSelection, item, rootScopeSpy;
  beforeEach(inject(function ($rootScope, _ActiveSelection_) {
    ActiveSelection = _ActiveSelection_;
    item = {"id": "123"};
    rootScopeSpy = spyOn($rootScope, "$broadcast").and.callThrough();
  }));

  it('should de defined', function () {
    expect(ActiveSelection).toBeDefined();
  });

  it("should get and set the active selection", function(){
    ActiveSelection.setActiveItem(item);
    expect(ActiveSelection.isActiveItem(item)).toBe(true);
    expect(ActiveSelection.isActiveItem({"id": "345"})).toBe(false);
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
    expect(rootScopeSpy).toHaveBeenCalledWith("ActiveSelection:activeItemChange", {data: {id: '123'}});
  });

});