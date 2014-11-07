/* global angular, _ */
 /*jshint -W055 */
 
'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('FavoritesService', ["$rootScope", "FavoritesModel", "Model", function($rootScope, FavoritesModel, Model) {
        var model, favs;

        model = new Model();
        angular.extend(this, model.prototype);
        favs = new model(FavoritesModel);
        angular.extend(this, favs);

        this.data = [];

        this.removeFavorite = function(itemID) {
            if (_.indexOf(this.data, itemID) > -1) {
                this.data.splice(_.indexOf(this.data, itemID), 1);
                this.unFavorite(itemID);
            }
        };
    
        // this.setFavorites = function(f){
        //     console.info("setting favorites");
        //     console.info(this);
        //     this.data = f;
        // };

        this.addFavorite = function(itemID) {
            this.data.push(itemID);
            this.setAsFavorite(itemID);
        };

        this.isFavorite = function(itemID) {
            var index = _.indexOf(this.data, itemID);
            return index > -1 ? true : false;
        };

        this.toggleFavorite = function(itemID) {

            if (this.isFavorite(itemID)) {
                this.removeFavorite(itemID);
            } else {
                this.addFavorite(itemID);
            }

        };

        this.getFavorites = function() {
            return this.data;
        };

    }]);