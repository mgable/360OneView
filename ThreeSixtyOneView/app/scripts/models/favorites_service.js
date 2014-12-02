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

        this.removeFavorite = function(itemID, type) {
            if (_.indexOf(this.data, itemID) > -1) {
                this.data.splice(_.indexOf(this.data, itemID), 1);
                this.unFavorite(itemID, type);
            }
        };

        this.addFavorite = function(itemID, type) {
            this.data.push(itemID);
            this.setAsFavorite(itemID, type);
        };

        this.isFavorite = function(_itemID_) {
            var itemID = _itemID_.toString(),
                index = _.indexOf(this.data, itemID);
            return index > -1 ? true : false;
        };

        this.toggleFavorite = function(_itemID_, type) {
            var itemID = _itemID_.toString();
            if (this.isFavorite(itemID)) {
                this.removeFavorite(itemID, type);
            } else {
                this.addFavorite(itemID, type);
            }
        };

        this.getFavorites = function() {
            return this.data;
        };

    }]);