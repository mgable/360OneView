/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ScenarioModel', ["$location", "Resource", "CONFIG", "SERVER", function($location, Resource, CONFIG, SERVER){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarios),
    responseTranslator = CONFIG.application.models.ScenarioModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioModel.requestTranslator,
    config = {};

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource,
        get: function(uid) {
            this.unwrap(this.resource.get({"id": uid}, this.config));
            return this.$futureData;
        },
        create: function(_project_, _scenario_){
            return resource.create(_scenario_, this.config, _project_.id).then(function(response){
                return response;
            });
        }

    };
}]);

