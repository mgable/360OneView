'use strict';

angular.module('filemanagerApp')
    .directive('fileManagementButtons', function() {
        return {
            templateUrl: '/views/directives/fileManagementButtons.html',
            restrict: 'E',
        };
    });