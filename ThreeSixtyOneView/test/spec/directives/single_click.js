'use strict';

describe('Directive: singleClick', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView.directives'));

  var element,
    $timeout,
    scope;

  beforeEach(inject(function ($rootScope, _$timeout_, $compile) {
    scope = $rootScope.$new();
    scope.singleClick = jasmine.createSpy("singleClick");
    scope.doubleClick = jasmine.createSpy("doubleClick");
    $timeout = _$timeout_;
    element = angular.element('<a single-click="singleClick()" ng-dblClick="doubleClick()"></a>');
    element = $compile(element)(scope);
  }));

  it('should single click properly', function () {
    element.click();
    $timeout.flush();
    expect(scope.singleClick).toHaveBeenCalled();
    expect(scope.doubleClick).not.toHaveBeenCalled();
  });

  it('should double click properly', function () {
    element.dblclick();
    expect(scope.singleClick).not.toHaveBeenCalled();
    expect(scope.doubleClick).toHaveBeenCalled();
  });
});
