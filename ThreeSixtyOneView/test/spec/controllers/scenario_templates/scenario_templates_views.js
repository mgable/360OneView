'use strict';

describe('Controller: ScenarioTemplatesViewsCtrl', function () {

  // load the controller's module
  beforeEach(module('ThreeSixtyOneView'));

  var ScenarioTemplatesViewsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScenarioTemplatesViewsCtrl = $controller('ScenarioTemplatesViewsCtrl', {
      $scope: scope
    });
  }));
});
