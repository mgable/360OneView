'use strict';

angular.module('centralManagerApp')
    .factory("DropdownService", function() {
        var active; //ID of currently active 

        return {
            getActive: function() {
                return active;
            },
            setActive: function(which) {
                active = which;
            }
        }
    }).factory('SortAndFilterService', function($filter) {
        var sorters = {},
            filterBy = {},
            orderBy = "",
    reverse = false;
        return {
            activeFilters: {},
            searchText: "",
            setSorter: function(id, sorter) {
                sorters[id] = sorter;
            },
            getSorter: function(id) {
                return sorters[id];
            },
            setOrderBy: function(which) {
                orderBy = which;
                //$rootScope.$broadcast("orderBy")
            },
            getOrderBy: function() {
                return $filter('camelCase')(orderBy);
                //return orderBy;
            },
            setReverse: function(which) {
                reverse = which;
            },
            getReverse: function() {
                return reverse;
            },
            setFilterBy: function(filter, value) {
                filterBy[filter] = value;
            },
            getFilterBy: function() {
                return filterBy;
            },
            resetFilterBy: function() {
                filterBy = {};
            }
        };
    });