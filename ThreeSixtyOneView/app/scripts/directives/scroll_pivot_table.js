/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('scrollPivotTable', ["$window", function($window) {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {

                var spread = $("#pivotTable").wijspread("spread");
                var sheet = spread.getActiveSheet();
                var scrollTop = 250; /* Position when start to fix */

                // outer scrollbar link to the inner scrollbar
                angular.element($window).bind("scroll", function() {

                    var windowTop = this.pageYOffset;  /* Position to the top */
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

                // inner scrollbar link to the outer scrollbar
                sheet.bind($.wijmo.wijspread.Events.TopRowChanged, function (sender, args) {
                    $window.scrollTo(0, scrollTop + args.newTopRow * 100);
                });

            }
        };
    }]);
