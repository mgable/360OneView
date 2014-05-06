/* jshint unused:false */

'use strict';

angular.module('test1App')
    .directive('mainnav', function() {
        return {
            templateUrl: 'views/mainnav.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                // console.info(scope);
                // console.info(element);
                // console.info(attrs);
            },
            replace: true,
            scope: {
                data: '=menuItems'
            },
            controller: function($scope, $location) {
                $scope.currentLocation = $location.path().slice(1);
                $scope.isCurrentLocation = function(loc) {
                    var location = angular.lowercase(loc).replace(/\s/g, '');
                    return angular.lowercase(location) === $scope.currentLocation ? 'current' : '';
                };
            }
        };
    });