/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ScenarioModel', ["$location", "$rootScope", "$timeout", "Resource", "CONFIG", "ServerService", "EVENTS", function($location, $rootScope, $timeout, Resource, CONFIG, ServerService, EVENTS){
    var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.scenarios),
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
        planOfRecordCreating: false,
        data: [],
        create: function(projectUuid, scenario){
            var self = this;
            if(scenario.isPlanOfRecord) {
                this.planOfRecordCreating = true;
            }
            return resource.create(scenario, this.config, {id: projectUuid}).then(function(response){
                if(scenario.isPlanOfRecord) {
                    self.planOfRecordCreating = false;
                }
                return response;
            });
        },
        put: function(scenario, params, additionalPath){
            var self = this;
            return resource.put(scenario, this.config, params, additionalPath).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.id}));
                self.data.splice(index, 1, response);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: scenario
                    });
                });
            });
        }
    };
}]);

