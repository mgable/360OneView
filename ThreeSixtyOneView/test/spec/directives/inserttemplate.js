'use strict';

describe('Directive: insertTemplate', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<insert-template></insert-template>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the insertTemplate directive');
  }));
});
