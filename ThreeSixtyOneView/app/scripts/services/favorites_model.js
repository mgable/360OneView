/* global angular, _ */
/* jshint unused:false */
'use strict';

angular.module('ThreeSixtyOneView.services').factory('FavoritesModel', ["$timeout", "$location", "Resource", "CONFIG", "SERVER", function($timeout, $location, Resource, CONFIG, SERVER){
        var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.favorites),
        transformResponse = function(data){
            console.info("trandform");
            console.info(typeof data);
            console.info(data)
            if (data){
                return data ? _.pluck(JSON.parse(data), 'uuid') : "";
            }
        };

        return {
            resource: resource,
            config: {
                transformResponse: function(data){ return transformResponse(data);},
                transformRequest: function(data){ return JSON.stringify(data);}
            },
            setAsFavorite: function(id) {
                this.resource.post({'uuid': id}, this.config).then(function(response){
                    return response;
                });
            },
            unFavorite: function(id){
                var params = {params:{"uuid": id}};
                this.resource.delete(params, this.config).then(function(response){
                    return response;
                });
            }
        };
}]);
