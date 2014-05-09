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
            controller: function($scope, $location, MenuFactory) {
                $scope.data = MenuFactory.get("dashboard");
                $scope.isCurrentLocation = function(loc) {
                    var location = angular.lowercase(loc).replace(/\s/g, ''),
                        currentLocation = $location.path().slice(1);
                    return angular.lowercase(location) === currentLocation ? 'current' : '';
                };
            }
        };
    });