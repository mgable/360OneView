'use strict';

angular.module('ThreeSixtyOneView.services')
    .factory('ScenarioCalculateModel', ["$location", "Resource", "CONFIG", "SERVER", function ScenarioCalculateModel($location, Resource, CONFIG, SERVER) {

        var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarioAnalytics);

        return {
            resource: resource,
            config: {}
        };

    }]);
