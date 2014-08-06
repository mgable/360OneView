'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('FavoritesService', function() {
        var favorites = [],
            removeFavorite = function(itemID) {
                if (_.indexOf(favorites, itemID) > -1) {
                    favorites.splice(_.indexOf(favorites, itemID), 1);
                }
            };

        this.addFavorite = function(itemID) {
            favorites.push(itemID);
        }

        this.isFavorite = function(itemID) {
            var index = _.indexOf(favorites, itemID);
            return index > -1 ? true : false;
        }

        this.toggleFavorite = function(itemID) {
            if (this.isFavorite(itemID)) {
                removeFavorite(itemID);
            } else {
                this.addFavorite(itemID);
            }
        }

        this.getFavorites = function() {
            return favorites;
        }

    });