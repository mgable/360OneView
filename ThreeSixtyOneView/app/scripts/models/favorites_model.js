/* global angular, _ */
/* jshint unused:false */
'use strict';

angular.module('ThreeSixtyOneView.services').factory('FavoritesModel', ["$timeout", "$location", "Resource", "CONFIG", "ServerService", function($timeout, $location, Resource, CONFIG, ServerService){
        var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.favorites),
        transformResponse = function(_data_){
            if (_data_){
                var data = mapIt(JSON.parse(_data_), "id", "uuid");
                return data ? _.pluck(data, 'uuid') : "";
            }
            return _data_;
        },
        mapIt = function(arr, oldValue, newValue){
            return _.map(arr, function(k,v,l){
                var obj = {};
                if (k[oldValue]) {
                    obj[newValue] = k[oldValue].toString();
                } else {
                    obj[newValue] = k[newValue].toString();
                }
                return obj;
            });
        };

        return {
            resource: resource,
            config: {
                transformResponse: function(data){ return transformResponse(data);},
                transformRequest: function(data){ return JSON.stringify(data);}
            },
            setAsFavorite: function(id, type, item) {
                var params = {};
                params[type === "project" ? "uuid" : "id"] = id;
                if (type !== "project"){
                    params.type = item.type;
                }
                this.resource.post(params, this.config, {}, type).then(function(response){
                    return response;
                });
            },
            unFavorite: function(id, type){
                var params = {}, obj;
                params[type === "project" ? "uuid" : "id"] = id;
                obj = {"params": params};

                this.resource.delete(obj, this.config, {}, type).then(function(response){
                    return response;
                });
            },
            get: function(type){
                this.unwrap(this.resource.get("", this.config, type));
                 console.info(this.data);
                return this.$futureData;
            },
            getFavoritesScenarios: function(projectId){
                this.unwrap(this.resource.get({id: projectId}, this.config, "project/:id/scenario"));
                return this.$futureData;
            }
        };
}]);
