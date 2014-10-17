/* global angular, _ */
/* jshint unused:false */
'use strict';

angular.module('ThreeSixtyOneView.services').service('FavoritesModel', ["$location", "Resource", "CONFIG", "SERVER", "ModelModel", function($location, Resource, CONFIG, SERVER, ModelModel){
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.favorites), config = {};

    this.find = function(id) {
        ModelModel.unwrap.call(this, resource.get(id, config));
    };

    this.get = function() {
        return this.$futureData;
    };

    this.setAsFavorite = function(id) {
        resource.post({'uuid': id}, config).then(function(response){
            // TODO: see error responses
            //console.info(response);
        });
    };

    this.unFavorite = function(id){
        var params = {params:{"uuid": id}};
        resource.delete(params, config).then(function(response){
            console.info(response);
        });
    };

}]);
