'use strict';

describe('Service: Urlmaker', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView'));

  // instantiate service
  var Urlmaker, $location, spy;
  beforeEach(inject(function (_Urlmaker_, _$location_) {
    Urlmaker = _Urlmaker_;
    $location = _$location_;
    spy = spyOn($location, "path");
  }));

  it('should define an API', function () {
    expect(!!Urlmaker).toBe(true);
    expect(Urlmaker.gotoView).toBeDefined();
  });

  it("should make a dashboard url", function(){
    Urlmaker.gotoView('dashboard', 'foo');
    expect(spy).toHaveBeenCalledWith("/dashboard/foo");
  });

  it ("should make a project url", function(){
    Urlmaker.gotoView('projects');
    expect(spy).toHaveBeenCalledWith("/projects");
  });

  it ("should make a scenarioEdit url", function(){
    Urlmaker.gotoView('scenarioEdit', "foo", "bar");
    expect(spy).toHaveBeenCalledWith("/scenarioEdit/foo/bar");
  });

  it ("should make a scenarioCreate url", function(){
    Urlmaker.gotoView('scenarioCreate', "foo");
    expect(spy).toHaveBeenCalledWith("/scenarioCreate/foo");
  });
});
