'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotViewModel', ["$location", "Resource", "CONFIG", "SERVER", function PivotViewModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.pivotview);
    return {
        resource: resource,
        config: {},
        get: function(params) {
            this.unwrap(this.resource.get(params, this.config));
            return this.$futureData;
        }
    };
}]);
