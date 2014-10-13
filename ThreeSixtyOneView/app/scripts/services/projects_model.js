/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "EVENTS", "ModelModel", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, EVENTS, ModelModel){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator,
    config = ModelModel.makeConfig(ModelModel, responseTranslator, requestTranslator),
    self = this;
    return {
        resource: resource,
        config: config,
        // used for the rename functions
        put : function(_data_){
            resource.put(_data_, config).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
                self.data.splice(index, 1, response.data);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response.data,
                        original: _data_
                    });
                });
            });
        },
        create: function(_data_, cb) {
            resource.create(_data_, config).then(function(response) {
                $timeout(function() {
                    self.data.push(response.data);
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response.data,
                        original: _data_
                    });
                    if (cb) { cb(); }
                });
            });
        },
        rename: function(data){
            var obj = (_.pick(data, 'title', 'description', 'id'));
            if (typeof obj.description === "undefined"){
                obj.description = "";
            }
            put.call(this, obj);
        }
    };

















    // surface data for unit tests
    this.resource = resource;
    this.config = config;

}]);
