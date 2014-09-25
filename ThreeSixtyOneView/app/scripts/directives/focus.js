/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('focus', ["$timeout", function($timeout) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element[0].focus();
                }, 300);
            }
        };
    }]);