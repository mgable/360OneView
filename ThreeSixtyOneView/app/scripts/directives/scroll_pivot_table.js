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
                    scope.displayWidth = element[0].clientWidth;

                    if (windowTop > scrollTop && windowTop < scrollBottom) {
                        $('.display').css({
                            'position': 'fixed',
                            'top': 0,
                            'width': scope.displayWidth
                        });
                    } else {
                        $('.display').css({
                            'position': 'relative',
                            'top': 'auto',
                            'width': '100%'
                        });
                    }

                    scope.$apply();
                });
            }
        };
    }]);
