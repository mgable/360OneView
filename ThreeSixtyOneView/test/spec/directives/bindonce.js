'use strict';

describe('Directive: bindOnce', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView.directives'));

  var element,
    scope,
    myScope;

  beforeEach(inject(function ($compile, $rootScope, $timeout) {
    scope = $rootScope.$new();
    element = angular.element('<span bind-once></span>');
    element = $compile(element)(scope);
    scope.$digest();
    myScope = element.scope();
  }));

  it('should destroy the scope', inject(function ($timeout) {
    expect(myScope.$parent).not.toBe(null);
    expect($(element).hasClass('ng-scope')).toBe(true);
    $timeout.flush();
    expect(myScope.$parent).toBe(null);
    expect($(element).hasClass('ng-scope')).toBe(false);
  }));
});
