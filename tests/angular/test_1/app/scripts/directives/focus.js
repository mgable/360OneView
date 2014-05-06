/* jshint unused:false */

'use strict';

angular.module('test1App')
    .directive('focus', function($timeout) {
        return {
            restrict: 'AE',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element[0].focus();
                }, 100);
            }
        };
    });