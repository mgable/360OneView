'use strict';

angular.module('centralManagerApp')
    .service('SortAndFilterService', function($filter, $rootScope) {
        var sorters = {},
            filterBy = {},
            orderBy = "",
            reverse = false,
            activeFilters = {},
            selected = "",
            searchText = "",
            self = this;

        this.enabledDefaults = function(trueOrFalse) {
            enabledDefaultChecking = trueOrFalse;
        };
        this.setSorter = function(id, sorter) {
            sorters[id] = sorter;
        };
        this.getSorter = function(id) {
            return sorters[id];
        }
        this.setOrderBy = function(which) {
            orderBy = which;
            $rootScope.$broadcast('SortAndFilterService:filter');
        }
        this.getOrderBy = function() {
            return $filter('camelCase')(orderBy);
        }
        this.setReverse = function(which) {
            reverse = which;
            $rootScope.$broadcast('SortAndFilterService:filter');
        }
        this.getReverse = function() {
            return reverse;
        }
        this.setFilterBy = function(filter, value) {
            filterBy[filter] = value;
            $rootScope.$broadcast('SortAndFilterService:filter');
        }
        this.getFilterBy = function() {
            return filterBy;
        }
        this.resetFilterBy = function() {
            filterBy = {};
            $rootScope.$broadcast('SortAndFilterService:filter');
        }
        this.getActiveFilters = function() {
            return activeFilters;
        }
        // this.setActiveFilters = function(key, value) {
        //     activeFilters[key] = value;
        // }
        this.setActiveFilters = function(value) {
            activeFilters = value;
        }
        this.clearActiveFilters = function() {
            activeFilters = {};
        }
        this.getSearchText = function() {
            return this.searchText;
        }
        this.setSearchText = function(value) {
            searchText = value;
        }
        this.getSelected = function() {
            return selected;
        }
        this.setSelected = function(value) {
            selected = value;
        }

        this.searchText = searchText;

        this.setFilter = function(item) {
            if (item) {
                self.setSelected(item);
                self.setActiveFilters(item.filter);
            } else {
                self.clearActiveFilters();
            }

            $rootScope.$broadcast('SortAndFilterService:filter');
        }
    });