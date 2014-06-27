'use strict';

angular.module('centralManagerApp')
    .factory('FilterService', function() {
        return {
            activeFilters: {},
            filterBy: {},
            dateRange: '',
            searchText: ''
        };
    });