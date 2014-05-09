'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope) {
        console.info("MainCtrl");
    }).controller('FileManagerNavigationCtrl', function($scope) {
        $scope.selectedIndex = 0;

        $scope.toggleSelected = function(index) {
            if (index !== $scope.selectedIndex) {
                $scope.selectedIndex = index;
            } else {
                $scope.selectedIndex = -1;
            }
        };

        $scope.getClass = function(index) {
            if (index === $scope.selectedIndex) {
                return 'selected';
            } else {
                return '';
            }
        }
    });