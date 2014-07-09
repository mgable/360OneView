'use strict';

angular.module('centralManagerApp')
    .factory('SelectionService', function($rootScope, $filter) {
        // Service logic
        // ...

        var selectedItems = [],
            orderBy,
            reverse = false,
            active;

        // Public API here
        return {
            getSelectedItems: function(index) {
                return selectedItems[index];
            },
            setSelectedItems: function(index, item) {
                //console.info("I just set " + item + " at postion " + index)
                selectedItems[index] = item;
            },
            setOrderBy: function(which) {
                orderBy = which;
                $rootScope.$broadcast("orderBy")
            },
            getOrderBy: function() {
                return $filter('camelCase')(orderBy);
            },
            setReverse: function(which) {
                reverse = which;
            },
            getReverse: function() {
                return reverse;
            },
            setActive: function(which) {
                active = which;
            },
            getActive: function() {
                return active;
            }
        };
    });