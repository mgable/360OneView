'use strict';

angular.module('centralManagerApp')
    .service('ActiveSelection', function($rootScope) {
        // Service logic
        // ...

        var activeRow = "";

        // Public API here

        this.isActiveRow = function(item) {
            return activeRow === item
        },
        this.setActiveRow = function(item) {
            activeRow = this.isActiveRow(item) ? "" : item;
            $rootScope.$broadcast('activeRowChange');
        },

        this.getActiveRow = function(item) {
            return activeRow;
        }

        this.clearActiveRow = function() {
            activeRow = "";
        }

    });