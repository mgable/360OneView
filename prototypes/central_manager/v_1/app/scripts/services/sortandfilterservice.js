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
        this.setFilterBy = function(obj) {
            filterBy[obj.filter] = obj.value;
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
        this.getSelectedLabel = function() {
            return selected.label;
        }
        this.setSelected = function(value) {
            selected = value;
        }
        this.getCount = function() {
            return this.display.data.length;
        }
        this.clearSearchText = function() {
            this.searchText = searchText = "";
            this.filter();
        }

        this.searchText = searchText;

        this.setActiveFilter = function(item) {
            this.clearPipeline();

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
                case "filterPipeline":
                    this.clearActiveFilters();
                    this.addToPipline(toWhat);
                    break;
            }

            if (filter) {
                this.filter();
            }
        }

        this.init = function(config) {
            this.data = config.data;
            this.display = angular.copy(this.data);
            this.setFilter("orderBy", config.orderBy, false);
            this.setFilter("reverse", config.reverse, false);
            this.setFilter("activeFilter", config.filter, true);

            $rootScope.$on("ProjectsModel:dataChange", function(event, data) {
                self.data = data.data;
                self.filter();
            });
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
            temp = this.filterPipline(temp);
            this.display.data = temp;

            $rootScope.$broadcast('SortAndFilterService:filter');
        }

        var favorites = function(data) {
                return $filter('isFavorite')(data);
            },
            filters = [];

        this.addToPipline = function(which) {
            self.setSelected(which);
            filters.push(eval(which.filter));
        }

        this.clearPipeline = function() {
            filters = [];
        }

        this.filterPipline = function(data) {
            return (_.reduce(filters, function(memo, num) {
                console.info("filter pipeline");
                return num(memo);
                //return memo;
            }, data))
        }
    });