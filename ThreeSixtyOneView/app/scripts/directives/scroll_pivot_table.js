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
                    var details = element.parents().find('.details');
                    scope.containerWidth = details[0].offsetWidth;

                    if (windowTop > scrollTop && windowTop < scrollBottom) {
                        $('.display').css({
                            'position': 'fixed',
                            'top': 0,
                            'width': scope.containerWidth
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
