'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ExportResourceModel', ["$location", "Resource", "CONFIG", "SERVER", function ($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.exportResource);

    return {
        resource: resource,
        config: {}
    };
}]);