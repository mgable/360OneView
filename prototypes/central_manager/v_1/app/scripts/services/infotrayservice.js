'use strict';

angular.module('centralManagerApp')
    .service('InfoTrayService', function($rootScope, ActiveSelection) {
        var showInfoTray = false,
            self = this;

        this.toggleInfoTray = function() {
            showInfoTray = ActiveSelection.activeItem() ? true : false;
        };

        this.closeInfoTray = function() {
            showInfoTray = false;
            ActiveSelection.clearActiveItem()
        }

        this.getShowInfoTray = function() {
            return showInfoTray;
        }

        $rootScope.$on('SortAndFilterService:filter', self.closeInfoTray);
    });