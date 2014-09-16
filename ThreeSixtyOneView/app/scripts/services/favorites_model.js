/* global angular, _ */
'use strict';

    angular.module('ThreeSixtyOneView.services').service('FavoritesModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER){
        var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.favorites),
        // translator = CONFIG.application.models.ProjectsModel.translator, 
        config = {},
        unwrap = function(futureData) {
            var self = this;
            this.$futureData = futureData;
            this.$futureData.then(function(data) {
                $timeout(function() {
                    _.extend(self, data);
                });
            });
        };

        this.find = function(id) {
            unwrap.call(this, resource.get(id, config));
        };

        this.get = function() {
            return this.$futureData;
        };

        this.setAsFavorite = function(id) {
            resource.post({'uuid': id}, config).then(function(response){
                // TODO: see error responses
                console.info(response);
            });
        };

        this.unFavorite = function(id){
            var params = {params:{"uuid": id}};
            resource.delete(params, config).then(function(response){
                console.info(response);
            });
        };

    }]);
