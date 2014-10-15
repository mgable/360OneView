/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').service('ScenarioModel', ["$location", "Resource", "CONFIG", "SERVER", "ModelModel", function($location, Resource, CONFIG, SERVER, ModelModel){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarios),
    responseTranslator = CONFIG.application.models.ScenarioModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioModel.requestTranslator,
    config = ModelModel.makeConfig(ModelModel, responseTranslator, requestTranslator),
    self = this;

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    this.get = function(uid) {
        ModelModel.unwrap.call(this, resource.get(uid, config));
        return this.$futureData;
    };

    this.getScenarioById = function(scenarioId){
        return _.findWhere(this.data, {id:scenarioId});
    };

    this.create = function(scenario, id){
        return resource.create(scenario, config, id).then(function(response){
            self.data.push(response.data);
            return response.data;
        });
    };
}]);
