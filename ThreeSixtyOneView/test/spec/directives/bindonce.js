'use strict';

describe('Directive: bindOnce', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bind-once></bind-once>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
