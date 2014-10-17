/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "EVENTS", "Model", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, EVENTS, Model){

    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator,
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
        // used for the rename functions
        put : function(_data_){
            return resource.put(_data_, this.config).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
                self.data.splice(index, 1, response.data);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response.data,
                        original: _data_
                    });
                });
                return response.data;
            });
        },
        create: function(_data_) {
            return resource.create(_data_, this.config).then(function(response) {
                $timeout(function() {
                    self.data.push(response.data);
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response.data,
                        original: _data_
                    });

                    return response.data;
                });
            });
        },
        rename: function(data){
            var obj = (_.pick(data, 'title', 'description', 'id'));
            if (typeof obj.description === "undefined"){
                obj.description = "";
            }
            this.put(obj);
        }
    };

   

}]);
