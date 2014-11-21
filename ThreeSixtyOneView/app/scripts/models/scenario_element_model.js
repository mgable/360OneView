'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ScenarioElementModel', ["$location", "Resource", "CONFIG", "SERVER", function ($location, Resource, CONFIG, SERVER) {
     var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarioElement),
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
