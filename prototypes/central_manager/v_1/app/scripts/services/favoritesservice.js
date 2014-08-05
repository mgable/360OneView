'use strict';

angular.module('ThreeSixtyOneView')
    .service('FavoritesService', function() {
        var favorites = [],

            addFavorite = function(itemID) {
                favorites.push(itemID);
            },

            removeFavorite = function(itemID) {
                if (_.indexOf(favorites, itemID) > -1) {
                    favorites.splice(_.indexOf(favorites, itemID), 1);
                }
            }

        this.isFavorite = function(itemID) {
            var index = _.indexOf(favorites, itemID);
            return index > -1 ? true : false;
        }

        this.toggleFavorite = function(itemID) {
            if (this.isFavorite(itemID)) {
                removeFavorite(itemID);
            } else {
                addFavorite(itemID);
            }
        }

        this.getFavorites = function() {
            return favorites;
        }

    });