'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('CubeModel', ["$location", "Resource", "CONFIG", "SERVER", function CubeModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.cube.replace(/:id/, CONFIG.view.Scenario.cubeId));
    return {
        resource: resource,
        config: {}
    };
}]);
