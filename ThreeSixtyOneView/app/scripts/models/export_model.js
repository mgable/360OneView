'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ExportModel', ["$location", "Resource", "CONFIG", "SERVER", function ExportModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.exportFile);

    return {
        resource: resource,
        config: {}
    };
}]);