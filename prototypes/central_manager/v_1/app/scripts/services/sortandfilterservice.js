'use strict';

angular.module('centralManagerApp')
    .service('SortAndFilterService', function($filter, $rootScope, filterFilter) {
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
        this.setFilterBy = function(obj) {
            filterBy[obj.filter] = obj.value;
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

        this.setActiveFilter = function(item) {
            console.info("set filter")
            if (item) {
                self.setSelected(item);
                self.setActiveFilters(item.filter);
            } else {
                self.clearActiveFilters();
            }

            this.resetFilterBy();
            $rootScope.$broadcast("SortAndFilterService:resetFilterBy");
        }

        this.setFilter = function(which, toWhat, filter) {
            switch (which) {
                case "activeFilter":
                    this.setActiveFilter(toWhat);
                    break;
                case "reverse":
                    this.setReverse(toWhat);
                    break;
                case "filterBy":
                    this.setFilterBy(toWhat);
                    break;
                case "orderBy":
                    this.setOrderBy(toWhat);
                    break;
                case "reset":
                    this.resetFilterBy();
                    break;
            }

            if (filter) {
                this.filter();
            }
        }

        this.init = function(config) {
            console.info("init")
            this.data = config.data;
            this.display = angular.copy(this.data);
            this.setFilter("orderBy", config.orderBy, false);
            this.setFilter("reverse", config.reverse, false);
            this.setFilter("activeFilter", config.filter, true);
        }

        this.filter = function() {
            console.info("filter")
            var activeFilters = this.getActiveFilters(),
                filterBy = this.getFilterBy(),
                searchText = this.getSearchText(),
                temp = filterFilter(this.data.data, activeFilters);
            temp = filterFilter(temp, filterBy);
            temp = filterFilter(temp, searchText);
            temp = $filter('orderBy')(temp, this.getOrderBy(), this.getReverse());

            this.display.data = temp;
            $rootScope.$broadcast('SortAndFilterService:filter');
        }
    });