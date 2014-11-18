/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('scrollPivotTable', ["$window", function($window) {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {

                angular.element($window).bind("scroll", function() {

                    var spread = $("#spreadjs").wijspread("spread");
                    var windowTop      = this.pageYOffset;  /* Position to the top */
                    var scrollTop      = 250;               /* Position when start to fix */
                    var scrollBottom = scrollTop + 10 * (scope.row+1);
                    var details = element.parents().find('.details');
                    scope.containerWidth = details[0].offsetWidth;

                    if (windowTop >= scrollTop && windowTop <= scrollBottom) {
                        var rowTop = parseInt((windowTop-scrollTop)/10);
                        spread.showRow(rowTop, $.wijmo.wijspread.VerticalPosition.top);
                        $('.display').css({
                            'position': 'fixed',
                            'top': 0,
                            'width': scope.containerWidth
                        });
                    } else if (windowTop < scrollTop) {
                        scope.top = $('.display').offset().top;
                        $('.display').css({
                            'position': 'relative',
                            'top': 'auto',
                            'width': '100%'
                        });
                    } else {
                        $('.display').css({
                            'position': 'relative',
                            'top': scope.top + 'px',
                            'width': '100%'
                        });
                    }

                    scope.$apply();
                });
            }
        };
    }]);
