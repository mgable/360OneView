/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('resizePivotTable', ["$window", function($window) {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {

                var pivotBuilderMinHeight = 33;
                var pivotBuilderMaxHeight = 222;
                var pivotBuilderHeight    = pivotBuilderMaxHeight; /* initally pivot builder drawer is open */
                var pivotTableHeight;
                var containerHeight;
                var containerWidth;

                function adjustHeightOnResize() {

                    console.log(scope);
                    pivotBuilderHeight = $('#pivotBuilder').height() === pivotBuilderMinHeight ? pivotBuilderMinHeight : pivotBuilderMaxHeight;
                    pivotTableHeight   = $window.innerHeight - pivotBuilderHeight - 20;
                    containerHeight    = $window.innerHeight + 153 + 40;
                    containerWidth     = $('.details').width();
                    $('.display').width(containerWidth);
                    $('.Scenario').height(containerHeight);
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                }

                scope.adjustHeightOnClick = function() {

                    pivotBuilderHeight = $('#pivotBuilder').height() === pivotBuilderMinHeight ? pivotBuilderMaxHeight : pivotBuilderMinHeight;
                    pivotTableHeight   = $window.innerHeight - pivotBuilderHeight - 20;
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                };

                // Call to the function when the page is first loaded
                adjustHeightOnResize();

                angular.element($window).bind('resize', function() {

                    adjustHeightOnResize();
                    scope.$apply();

                });
            }

        };
    }]);
