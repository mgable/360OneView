'use strict';

angular.module('ThreeSixtyOneView')
    .directive('scrollPivotTable', ["$window", function($window) {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {

                angular.element($window).bind("scroll", function() {

                    var windowTop      = this.pageYOffset;  /* Position to the top */
                    var scrollTop      = 230;               /* Position when start to fix */
                    var scrollBottom   = 330;               /* Position when stop to fix */
                    scope.isFixed      = false;
                    scope.displayWidth = element[0].clientWidth;

                    if (windowTop > scrollTop && windowTop < scrollBottom) {
                        scope.isFixed = true;
                    } else {
                        scope.isFixed = false;
                    }

                    scope.$apply();
                });
            }
        };
    }]);
