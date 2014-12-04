'use strict';

describe('Directive: member', function () {

  // load the directive's module
  beforeEach(module('threeSixtOneViewApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<member></member>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the member directive');
  }));
});
