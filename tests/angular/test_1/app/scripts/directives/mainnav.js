'use strict';

angular.module('test1App')
    .directive('mainNav', function() {
        return {
            templateUrl: 'views/mainNav.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                console.info(scope);
            },
            replace: true,
            scope: {
                data: "=menuItems"
            }
        };
    });