'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotDataModel', ["$location", "Resource", "CONFIG", "SERVER", function PivotViewModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.pivotdata);

    return {
        resource: resource,
        config: {}
    };
}]);
