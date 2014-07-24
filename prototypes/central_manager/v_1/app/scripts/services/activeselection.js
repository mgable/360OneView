'use strict';

angular.module('centralManagerApp')
    .service('ActiveSelection', function($rootScope) {
        // Service logic
        // ...

        var activeItem = "",
            self = this;

        // Public API here

        this.isActiveItem = function(item) {
            return activeItem === item
        }

        this.setActiveItem = function(item) {
            activeItem = this.isActiveItem(item) ? "" : item;
            console.info(activeItem)
            $rootScope.$broadcast('ActiveSelection:activeItemChange', {
                data: activeItem
            });
        }

        this.getActiveItem = function(item) {
            return activeItem;
        }

        this.activeItem = function() {
            return (activeItem.length === 0) ? false : true;
        }

        this.clearActiveItem = function() {
            activeItem = "";
        }

        $rootScope.$on('FilesModel:edit', function(event, response) {
            self.setActiveItem(response.data);
        });

    });