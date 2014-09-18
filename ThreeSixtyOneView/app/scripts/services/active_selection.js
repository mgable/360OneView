'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ActiveSelection', ["$rootScope", function($rootScope) {

        var activeItem = "";

        this.isActiveItem = function(item) {
            return activeItem === item;
        };

        this.setActiveItem = function(item) {
            activeItem = this.isActiveItem(item) ? "" : item;
            $rootScope.$broadcast('ActiveSelection:activeItemChange', {
                data: activeItem
            });
        };

        this.getActiveItem = function() {
            return activeItem;
        };

        this.activeItem = function() {
            return (activeItem.length === 0) ? false : true;
        };

        this.clearActiveItem = function() {
            activeItem = "";
        };
    }]);