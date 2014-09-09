'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('FavoritesService', ["FavoritesModel", function(FavoritesModel) {
        var favorites = [],
            removeFavorite = function(itemID) {
                if (_.indexOf(favorites, itemID) > -1) {
                    favorites.splice(_.indexOf(favorites, itemID), 1);
                }
            };

        this.setFavorites = function(f){
            favorites = f;
        }

        this.addFavorite = function(itemID) {
            favorites.push(itemID);
            FavoritesModel.setAsFavorite(itemID)
        }

        this.isFavorite = function(itemID) {
            var index = _.indexOf(favorites, itemID);
            return index > -1 ? true : false;
        }

        this.toggleFavorite = function(item, evt) {
            var itemID = item.id;

            if (this.isFavorite(itemID)) {
                removeFavorite(itemID);
            } else {
                this.addFavorite(itemID);
            }
            
            if (evt){
                evt.stopPropagation();
            }
        }

        this.getFavorites = function() {
            return favorites;
        }

    }]);