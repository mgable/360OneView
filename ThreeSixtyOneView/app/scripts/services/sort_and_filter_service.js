/* global _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('SortAndFilterService', ["$filter", "$rootScope", "filterFilter", function($filter, $rootScope, filterFilter) {
        var sorters = {}, // <ms-dropdown> instances
            filterBy = {}, // <ms-dropdown> instances filter selection
            orderBy = "", // <ms-dropdown> instances orderby selection
            reverse = false, // <ms-dropdown> instances reverse selection
            activeFilters = {}, // filters (from filter include)
            selected = {
                'label': 'default'
            }, // selected filter (use for display label)
            searchText = "", // search input text value
            filters = [], // additional filters
            data = {}, // holds all data
            display = {}, // holds filtered data
            set = { // object mapping
                "activeFilter": function(toWhat) {
                    setActiveFilter(toWhat);
                },
                "reverse": function(toWhat) {
                    this.setReverse(toWhat);
                },
                "filterBy": function(toWhat) {
                    this.setFilterBy(toWhat);
                },
                "orderBy": function(toWhat) {
                    this.setOrderBy(toWhat);
                },
                "reset": function() {
                    resetFilterBy();
                },
                "filterPipeline": function(toWhat) {
                    resetActiveFilters();
                    setSelected(toWhat);
                    addToPipline(toWhat);
                }
            },
            getFilter = function(filter) {
                return function(data) {
                    return $filter(filter)(data);
                };
            },
            addToPipline = function(which) {
                var filter = getFilter(which.filter);
                filters.push(filter);
            },
            clearPipeline = function() {
                filters = [];
            },
            filterPipline = function(data) {
                return (_.reduce(filters, function(memo, num) {
                    return num(memo);
                }, data));
            },
            resetFilterBy = function() {
                filterBy = {};
            },

            setActiveFilters = function(value) {
                activeFilters = value;
            },

            resetActiveFilters = function() {
                activeFilters = {};
            },
            setSelected = function(value) {
                selected = value;
            },
            setActiveFilter = function(item) {
                clearPipeline();

                if (item) {
                    setSelected(item);
                    setActiveFilters(item.filter);
                } else {
                    resetActiveFilters();
                }

                resetFilterBy();
                $rootScope.$broadcast("SortAndFilterService:resetFilterBy");
            },
            self = this;
            display.data = {};

        this.setSorter = function(id, sorter) {
            sorters[id] = sorter;
        };

        this.getSorter = function(id) {
            return sorters[id];
        };

        this.setOrderBy = function(which) {
            orderBy = which;
        };

        this.getOrderBy = function() {
            return orderBy;
        };

        this.isActive = function(which){
            return this.getOrderBy() === which;
        };

        this.setReverse = function(which) {
            reverse = which;
        };

        this.getReverse = function() {
            return reverse;
        };

        this.setFilterBy = function(obj) {
            filterBy = obj;
        };

        this.getFilterBy = function() {
            return filterBy;
        };

        this.hasFilterBy = function(){
            return !_.isEmpty(filterBy) ? true : false;
        };

        this.getActiveFilters = function() {
            return activeFilters;
        };

        this.getSearchText = function() {
            return this.searchText;
        };

        this.setSearchText = function(value) {
            this.searchText = searchText = value;
        };

        this.resetSearchText = function() {
            this.searchText = searchText = "";
            this.filter();
        };

        this.getSelected = function() {
            return selected;
        };

        this.getSelectedLabel = function() {
            return selected.label;
        };

        this.getCount = function() {
            try{
                return display.data.length;
            }catch(e){
                console.info("No data");
            }
        };

        this.getData = function() {
            return display.data;
        };

        this.searchText = searchText;

        this.setFilter = function(which, toWhat, filter) {
            set [which].call(this, toWhat);

            if (filter) {
                this.filter();
            }
        };

        this.init = function(config) {
            data = config.data;
            display = angular.copy(data);
            this.setFilter("orderBy", config.orderBy, false);
            this.setFilter("reverse", config.reverse, false);
            this.setFilter("activeFilter", config.filter, true);

            $rootScope.$on("ProjectsModel:dataChange", function(event, response) {
                $rootScope.$apply(function(){
                    data.data = response.data;
                    self.filter();
                });
            });
        };

        this.filter = function() {
            var activeFilters = this.getActiveFilters(),
                filterBy = this.getFilterBy(),
                searchText = this.getSearchText(),
                temp = data.data;
            temp = filterFilter(temp, activeFilters);
            temp = filterFilter(temp, filterBy);
            temp = filterFilter(temp, {
                title: searchText
            });
            temp = $filter('orderBy')(temp, this.getOrderBy(), this.getReverse());
            temp = filterPipline(temp);

            display.data = temp;
        };
    }]);