'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ReportsModel', ["$location", "Resource", "CONFIG", "SERVER", function ReportsModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.reports);

    return {
        resource: resource,
        config: {}
    };
}]);
