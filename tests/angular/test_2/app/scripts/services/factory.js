'use strict';

angular.module('filemanagerApp')
    .factory('filterService', function() {
        return {
            activeFilters: {},
            searchText: ''
        };
    });