/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('resizePivotTable', ["$rootScope", "$window", "EVENTS", function($rootScope, $window, EVENTS) {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {

                var pivotBuilderMinHeight = 30;
                var pivotBuilderMaxHeight = 330;
                var pivotBuilderHeight = pivotBuilderMaxHeight;
                var pivotTableHeight;

                function adjustHeightOnResize() {

                    pivotBuilderHeight = $('#pivotBuilder').height() === pivotBuilderMinHeight ? pivotBuilderMinHeight : pivotBuilderMaxHeight;
                    pivotTableHeight = $window.innerHeight - pivotBuilderHeight - 20;

                    var details = element.parents().find('.details');
                    scope.containerWidth = details[0].offsetWidth;

                    var display = element.parents().find('.display');
                    display.width(scope.containerWidth);

                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                    scope.row = 50 - (parseInt(pivotTableHeight / 40) - 2);
                    scope.containerHeight = 150 + $window.innerHeight + (scope.row) * 100 + 100;
                    $('.Scenario').height(scope.containerHeight);

                }

                $rootScope.$on(EVENTS.toggleBuilder, function(event, data){

                    pivotBuilderHeight = data === "open" ? pivotBuilderMaxHeight : pivotBuilderMinHeight;
                    pivotTableHeight = $window.innerHeight - pivotBuilderHeight - 20;
                    scope.row = 50 - (parseInt(pivotTableHeight / 40) - 2);
                    scope.containerHeight = 150 + $window.innerHeight + (scope.row) * 100 + 100;
                    $('.Scenario').height(scope.containerHeight);
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                });

                // Call to the function when the page is first loaded
                adjustHeightOnResize();

                angular.element($window).bind('resize', function() {

                    adjustHeightOnResize();
                    scope.$apply();

                });
            }

        };
    }]);
