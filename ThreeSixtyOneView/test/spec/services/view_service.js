'use strict';

describe('Service: View Service', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var ViewService, $rootScope, data, onSpy, customMatchers = {
        toMatch : function(util, customEquilityTesters){
            return {
                compare: function (actual, expected){
                    var result = {};
                    result.pass = true;
                    _.each(actual, function(v,k,o){
                      if(k in expected){
                        if(v.toString() !== expected[k].toString()){
                          result.pass = false;
                        }
                      } else {
                        result.pass = false;
                      }
                    });

                    if (result.pass){
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' not equal';
                    } else {
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' is equal';
                    }
                    return result;
                }
            };
        }
    };

  beforeEach(function(){
      jasmine.addMatchers(customMatchers);
  });

  beforeEach(inject(function (_$rootScope_, _ViewService_) {
    $rootScope = _$rootScope_;
    onSpy = spyOn($rootScope, "$on").and.callThrough();
    ViewService = _ViewService_;
    data = "foo";
  }));

  it ("should be defined and define an API", function(){
    expect(ViewService).toBeDefined();
    expect(ViewService.setModel).toBeDefined();
    expect(ViewService.getModel).toBeDefined();
    expect(ViewService.setCurrentView).toBeDefined();
    expect(ViewService.getCurrentView).toBeDefined();
  });

  it("should set and get the model", function(){
    ViewService.setModel(data);
    expect(ViewService.getModel()).toBe(data);
  });

  it ("should get and set the current view", function(){
    ViewService.setCurrentView(data);
    expect(ViewService.getCurrentView()).toBe(data);
  });

  it ("should broadcast and event when the model is set", function(){
    var broadcastSpy = spyOn($rootScope, "$broadcast");
    ViewService.setModel(data);
    expect(broadcastSpy).toHaveBeenCalledWith("ViewService:modelChange","foo");
  });

  it ("should listen for $stateChangeSuccess events", function(){
    ViewService.init();
    expect(onSpy).toMatch('$stateChangeSuccess', Function);
  });
});