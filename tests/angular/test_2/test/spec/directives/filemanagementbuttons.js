'use strict';

describe('Directive: fileManagementButtons', function () {

  // load the directive's module
  beforeEach(module('test1App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-management-buttons></file-management-buttons>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fileManagementButtons directive');
  }));
});
