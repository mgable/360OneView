/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('resizePivotTable', ["$rootScope", "$window", "EVENTS", "$timeout",
        function($rootScope, $window, EVENTS, $timeout) {
            return {
                restrict: 'AE',
                link: function(scope, element, attributes) {

                    var pivotBuilderHeight = 30;
                    var pivotTableHeight;

                    function adjustHeightOnResize() {

                        pivotTableHeight = $window.innerHeight - pivotBuilderHeight - 20;

                        var details = element.parents().find('.details');
                        scope.containerWidth = details[0].offsetWidth;

                        var display = element.parents().find('.display');
                        display.width(scope.containerWidth);

                        $('#spreadjs').height(pivotTableHeight);
                        $('#spreadjs').wijspread('refresh');

                        scope.row = scope.rowCnt - (parseInt(pivotTableHeight / 40) - scope.rowHeaderCnt);
                        scope.containerHeight = 150 + $window.innerHeight + (scope.row) * 100 + 100;
                        $('.Scenario').height(scope.containerHeight);

                    }

                    $rootScope.$on(EVENTS.heightChanged, function(event, data){

                        pivotTableHeight = $window.innerHeight - data - 20;

                        scope.row = scope.rowCnt - (parseInt(pivotTableHeight / 40) - scope.rowHeaderCnt);
                        scope.containerHeight = 150 + $window.innerHeight + (scope.row) * 100 + 100;
                        $('.Scenario').height(scope.containerHeight);

                        $('#spreadjs').height(pivotTableHeight);
                        $('#spreadjs').wijspread('refresh');

                    });

                    $timeout(function() {

                        // Call to the function when the page is first loaded
                        adjustHeightOnResize();

                    }, 400);

                    angular.element($window).bind('resize', function() {

                        adjustHeightOnResize();
                        scope.$apply();

                    });
                }

            };
    }]);
