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
                    var scrollBottom = scrollTop + 100 * (scope.row+1);
                    var details = element.parents().find('.details');
                    scope.containerWidth = details[0].offsetWidth;

                    if (windowTop >= scrollTop && windowTop <= scrollBottom) {
                        var rowTop = Math.floor((windowTop-scrollTop)/100);
                        spread.showRow(rowTop, $.wijmo.wijspread.VerticalPosition.top);
                        $('.display').css({
                            'position': 'fixed',
                            'top': 0,
                            'width': scope.containerWidth
                        });
                    } else if (windowTop < scrollTop) {
                        $('.display').css({
                            'position': 'relative',
                            'top': 'auto',
                            'bottom': 'auto',
                            'width': '100%'
                        });
                    } else if (windowTop > scrollBottom) {
                        $('.display').css({
                            'width': scope.containerWidth,
                            'position': 'absolute',
                            'bottom': '200px',
                            'top': 'auto'
                        });
                    }

                    scope.$apply();
                });
            }
        };
    }]);
