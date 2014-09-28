'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('InfoTrayService', ["$rootScope", "ActiveSelection", function($rootScope, ActiveSelection) {
        var showInfoTray = false;

        this.toggleInfoTray = function() {
            showInfoTray = ActiveSelection.activeItem() ? true : false;
        };

        this.closeInfoTray = function() {
            showInfoTray = false;
            ActiveSelection.clearActiveItem();
        };

        this.getShowInfoTray = function() {
            return showInfoTray;
        };
    }]);