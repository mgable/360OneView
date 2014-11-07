/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive("scrollPivotTable", function($window) {
        return function(scope) {

            angular.element($window).bind("scroll", function() {

                var windowTop = $(window).scrollTop();

                if (windowTop > 230  && windowTop < 340) {
                    $('.display').css({
                        position: 'fixed',
                        top: 0,
                        width: '1100px'
                    });
                } else {
                    $('.display').css({
                        position: 'relative',
                        top: 'auto'
                    });
                }

                scope.$apply();

            });

        };
    });
