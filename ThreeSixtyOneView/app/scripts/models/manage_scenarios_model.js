'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ManageScenariosModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
     var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.scenarioElement),
    responseTranslator = CONFIG.application.models.ScenarioElement.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioElement.requestTranslator,
    config = {};

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource
    };
  }]);
