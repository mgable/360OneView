/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "EVENTS", "Model", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, EVENTS, Model){

    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator;


    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource,
        data: [],
        // used for the rename functions
        put : function(_data_){
            var self = this;
            resource.put(_data_, this.config).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.id}));
                self.data.splice(index, 1, response);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: _data_
                    });
                });
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
        setConfig: function(_config_){
            this.config = _config_;
        }
    };

   

}]);
