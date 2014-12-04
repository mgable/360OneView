'use strict';

xdescribe('Directive: collection', function () {

  // load the directive's module
  beforeEach(module('threeSixtOneViewApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<collection></collection>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the collection directive');
  }));
});
