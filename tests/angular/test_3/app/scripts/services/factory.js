'use strict';

angular.module('fileManagerApp')
    .factory('FilterService', function() {
        return {
            activeFilters: {},
            filterBy: {},
            dateRange: '',
            searchText: ''
        };
    });