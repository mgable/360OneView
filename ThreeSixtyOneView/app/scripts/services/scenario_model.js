/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ScenarioModel', ["$location", "Resource", "CONFIG", "SERVER", "Model", function($location, Resource, CONFIG, SERVER, Model){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarios),
    responseTranslator = CONFIG.application.models.ScenarioModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioModel.requestTranslator,
    config = {},
    self = this;

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource,
        config: config,
        get: function(uid) {
            this.unwrap(this.resource.get(uid, config));
            return this.$futureData;
        },

        getScenarioById: function(scenarioId){
            return _.findWhere(this.data, {id:scenarioId});
        },

        create: function(scenario, id){
            return resource.create(scenario, config, id).then(function(response){
                console.info (response);
            });
        },
        setConfig: function(_config_){
            config = _config_;
        }
    };
}]);
