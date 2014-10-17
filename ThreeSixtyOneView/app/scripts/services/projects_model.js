/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "EVENTS", "Model", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, EVENTS, Model){

    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator;

     // surface data for unit tests
    // this.resource = resource;
    // this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource,
        // used for the rename functions
        put : function(_data_){
            var self = this;
            return resource.put(_data_, this.config).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.id}));
                self.data.splice(index, 1, response);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: _data_
                    });
                });
                return response.data;
            });
        },
        create: function(_data_) {
            var self = this;
            return resource.create(_data_, this.config).then(function(response) {
                self.data.push(response);
                $timeout(function() {
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: _data_
                    });
                });
                return response;
            });
        },
        rename: function(data){
            var obj = (_.pick(data, 'title', 'description', 'id'));
            if (typeof obj.description === "undefined"){
                obj.description = "";
            }
            this.put(obj);
        },
        setConfig: function(_config_){
            this.config = _config_;
        }
    };

   

}]);
