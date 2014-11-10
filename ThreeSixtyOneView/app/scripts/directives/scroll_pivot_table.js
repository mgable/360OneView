/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive("scrollPivotTable", function($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {

                angular.element($window).bind("scroll", function() {

                    scope.isFixed = false;
                    var windowTop = this.pageYOffset;
                    scope.displayWidth = element[0].clientWidth;

                    if (windowTop > 230 && windowTop < 330) {
                        scope.isFixed = true;
                    } else {
                        scope.isFixed = false;
                    }

                    scope.$apply();
                });
            }
        }
    });
