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

        this.setSorter = function(id, sorter) {
            sorters[id] = sorter;
        };
        this.getSorter = function(id) {
            return sorters[id];
        }
        this.setOrderBy = function(which) {
            orderBy = which;
        }
        this.getOrderBy = function() {
            return $filter('camelCase')(orderBy);
        }
        this.setReverse = function(which) {
            reverse = which;
        }
        this.getReverse = function() {
            return reverse;
        }
        this.setFilterBy = function(filter, value) {
            filterBy[filter] = value;
        }
        this.getFilterBy = function() {
            return filterBy;
        }
        this.resetFilterBy = function() {
            filterBy = {};
        }
        this.getActiveFilters = function() {
            return activeFilters;
        }
        this.setActiveFilters = function(key, value) {
            activeFilters[key] = value;
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
            selected = value
        }

        this.searchText = searchText;

        this.setFilter = function(filter) {

            self.setSelected(filter);

            if (filter === "defaults") {
                activeFilters.defaults = true;
                activeFilters.type = '';
            } else {
                activeFilters.defaults = '';
                activeFilters.type = filter;
            }

            $rootScope.$broadcast('SortAndFilterService:filter');
        }
    });