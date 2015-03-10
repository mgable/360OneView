'use strict';

describe('Controller: ModalScenarioTemplatesCtrl', function () {

  // load the controller's module
  beforeEach(module('ThreeSixtyOneView'));

  var ModalScenarioTemplatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalScenarioTemplatesCtrl = $controller('ModalScenarioTemplatesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
