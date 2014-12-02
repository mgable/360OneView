'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('CubeModel', ["$location", "Resource", "CONFIG", "SERVER", function CubeModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.cube);
    return {
        resource: resource,
        config: {}
    };
}]);
