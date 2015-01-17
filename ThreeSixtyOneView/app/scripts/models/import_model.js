'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ImportModel', ["$location", "Resource", "CONFIG", "SERVER", function ImportModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.upload);

    return {
        resource: resource,
        config: {}
    };
}]);
