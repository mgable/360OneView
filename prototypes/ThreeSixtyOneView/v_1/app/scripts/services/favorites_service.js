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

        this.toggleFavorite = function(item, evt) {
            var itemID = item.id;
            if (item.access === "Everyone can edit"){
                if (this.isFavorite(itemID)) {
                    removeFavorite(itemID);
                } else {
                    this.addFavorite(itemID);
                }
            }
            if (evt){
                evt.stopPropagation();
            }
        }

        this.getFavorites = function() {
            return favorites;
        }

    });