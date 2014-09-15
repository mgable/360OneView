'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('InfoTrayService', ["$rootScope", "ActiveSelection", function($rootScope, ActiveSelection) {
        var showInfoTray = false,
            self = this;

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

        $rootScope.$on('SortAndFilterService:filter', self.closeInfoTray);
    }]);