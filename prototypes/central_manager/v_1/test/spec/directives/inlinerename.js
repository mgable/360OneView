'use strict';

describe('Directive: inlineRename', function () {

  // load the directive's module
  beforeEach(module('centralManagerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<inline-rename></inline-rename>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inlineRename directive');
  }));
});
