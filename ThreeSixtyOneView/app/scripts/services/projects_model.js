/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').service('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "ModelModel", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, ModelModel){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator,
    config = ModelModel.makeConfig(ModelModel,responseTranslator, requestTranslator),

    // used for the rename functions
    put = function(data){
        resource.put(data, config).then(function(response){
            var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
            self.data.splice(index, 1, response.data);
            $timeout(function(){
                 $rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: self.data
                });

                // update active selection for data bind in tray
                $rootScope.$broadcast("ProjectsModel:rename", {
                    data: response.data
                });
            });
        });
    },
    self = this;

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    this.find = function(uid) {
        ModelModel.unwrap.call(this, resource.get(uid, config));
    };

    this.get = function() {
        return this.$futureData;
    };

    this.create = function(_data_) {
        resource.create(_data_, config).then(function(response) {
            $timeout(function() {
                self.data.push(response.data);
                $rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: self.data
                });
                $rootScope.$broadcast("ProjectsModel:create", _data_);
            });
        });
    };

    this.rename = function(data){
        var obj = (_.pick(data, 'title', 'description', 'id'));
        if (typeof obj.description === "undefined"){
            obj.description = "";
        }
        put.call(this, obj);
    };
}]);
