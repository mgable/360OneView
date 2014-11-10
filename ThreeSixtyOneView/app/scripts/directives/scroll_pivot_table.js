/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive("scrollPivotTable", function($window) {
        return function(scope) {

            angular.element($window).bind("scroll", function() {

                scope.isFixed = false;
                var windowTop = this.pageYOffset;

                if (windowTop > 230  && windowTop < 342) {
                    scope.isFixed = true;
                } else {
                    scope.isFixed = false;
                }

                scope.$apply();

            });

        };
    });
