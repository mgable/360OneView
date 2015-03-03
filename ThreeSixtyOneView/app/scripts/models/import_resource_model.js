'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ImportResourceModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
    var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.importResource);

    return {
        resource: resource,
        config: {}
    };
}]);
