/* global xit, xdescribe */

'use strict';

xdescribe('Directive: isUnique', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<is-unique></is-unique>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the isUnique directive');
  }));
});
