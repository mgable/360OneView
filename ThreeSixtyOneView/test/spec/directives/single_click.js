'use strict';

xdescribe('Directive: singleClick', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView.directives'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<single-click></single-click>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the singleClick directive');
  }));
});
