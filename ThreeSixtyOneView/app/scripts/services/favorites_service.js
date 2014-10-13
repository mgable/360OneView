/* global angular, _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('FavoritesService', ["$rootScope", "FavoritesModel", "Model", function($rootScope, FavoritesModel, Model) {
        var favoritesList = [], FavsModel, favs;

        FavsModel = new Model();
        angular.extend(this, FavsModel.prototype);
        favs = new FavsModel(FavoritesModel);
        angular.extend(this, favs);

        console.info(this);

        this.removeFavorite = function(itemID) {
            if (_.indexOf(favoritesList, itemID) > -1) {
                favoritesList.splice(_.indexOf(favoritesList, itemID), 1);
                this.unFavorite(itemID);
            }
        };
    
        this.setFavorites = function(f){
            favoritesList = f;
        };

        this.addFavorite = function(itemID) {
            favoritesList.push(itemID);
            this.setAsFavorite(itemID);
        };

        this.isFavorite = function(itemID) {
            var index = _.indexOf(favoritesList, itemID);
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
            return favoritesList;
        };

    }]);