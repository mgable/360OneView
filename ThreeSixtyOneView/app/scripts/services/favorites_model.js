/* global angular, _ */
/* jshint unused:false */
'use strict';

angular.module('ThreeSixtyOneView.services').factory('FavoritesModel', ["$timeout", "$location", "Resource", "CONFIG", "SERVER", function($timeout, $location, Resource, CONFIG, SERVER){
        var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.favorites);
        return {
            resource: resource, 
            config: {},
            find: function(id) {
                this.unwrap(this.resource.get(id, this.config));
            },
            get: function() {
                return this.$futureData;
            },
            setAsFavorite: function(id) {
                this.resource.post({'uuid': id}, this.config).then(function(response){
                    // TODO: see error responses
                    //console.info(response);
                });
            },
            unFavorite: function(id){
                var params = {params:{"uuid": id}};
                this.resource.delete(params, this.config).then(function(response){
                    console.info(response);
                });
            },
            unwrap: function(futureData) {
                var self = this;
                this.$futureData = futureData;
                this.$futureData.then(function(data) {
                    $timeout(function() {
                        _.extend(self, data);
                    });
                });
            }
        }
}]);
