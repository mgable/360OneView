'use strict';

describe('Controller: ModelScenarioTemplatesServiceCtrl', function () {

  // load the controller's module
  beforeEach(module('ThreeSixtyOneView'));

  var ModelScenarioTemplatesServiceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModelScenarioTemplatesServiceCtrl = $controller('ModelScenarioTemplatesServiceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
