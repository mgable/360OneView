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
            }
        };

        this.addFavorite = function(itemID) {
            this.data.push(itemID);
        };

        this.isFavorite = function(_itemID_) {
            var itemID = _itemID_.toString(),
                index = _.indexOf(this.data, itemID);
            return index > -1 ? true : false;
        };

        this.toggleFavorite = function(id, type, item) {
            var itemID = id.toString();
            if (this.isFavorite(itemID)) {
                this.removeFavorite(itemID, type);
                this.unFavorite(itemID, type);
            } else {
                this.addFavorite(itemID);
                this.setAsFavorite(itemID, type, item);
            }
        };

        this.getFavorites = function() {
            return this.data;
        };

    }]);