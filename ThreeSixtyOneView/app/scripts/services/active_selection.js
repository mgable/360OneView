'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ActiveSelection', ["$rootScope", "EVENTS", function($rootScope, EVENTS) {
        var activeItem = "", self = this, radio = true;

        this.isActiveItem = function(item) {
            return activeItem === item;
        };

        this.setActiveItem = function(item) {
            activeItem = radio ? item : this.isActiveItem(item) ? "" : item;
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

        this.setRadio = function(trueOrFalse){
            radio = trueOrFalse;
        };

        // if a new item is created, update display
        $rootScope.$on(EVENTS.updateProjects, function(event, data){
            self.setActiveItem(data.item);
        });
    }]);