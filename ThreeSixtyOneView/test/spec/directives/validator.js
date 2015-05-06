/* global xit, xdescribe */
'use strict';

describe('Directive: validator', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView.directives'));

  var element,
    scope,
    ctrl;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.name = "abc";
    scope.isScenarioTitleUnique = function(scenarioTitle) {
      return ! _.findWhere([{title:"xyz"}, {title:"123"}, {title:"abc"}], {title:scenarioTitle});
    };
    element = angular.element('<form name="theForm"><input type="text" error-type="\'isNotUnique\'" name="theName" ng-model="name" validator="isScenarioTitleUnique"></input></form>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should test for unique input', inject(function () {
    expect(scope.theForm.theName.$error.isNotUnique).toBeTruthy();
    scope.$apply(function(){scope.name = "abx";});
    expect(scope.theForm.theName.$error.isNotUnique).toBeFalsy();
  }));


});
