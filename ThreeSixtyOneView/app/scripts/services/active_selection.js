'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ActiveSelection', ["$rootScope", "EVENTS", function($rootScope, EVENTS) {

        var activeItem = "", self = this;

        this.isActiveItem = function(item) {
            return activeItem === item;
        };

        this.setActiveItem = function(item) {
            //activeItem = this.isActiveItem(item) ? "" : item;
            activeItem = item;
            $rootScope.$broadcast(EVENTS.changeActiveItem, activeItem);
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

        $rootScope.$on(EVENTS.updateProjects, function(event, data){
            self.setActiveItem(data.item);
        });
    }]);