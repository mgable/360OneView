'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ImportResourceModel', ["$location", "Resource", "CONFIG", "SERVER", function ($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.importResource);

    return {
        resource: resource,
        config: {}
    };
}]);
