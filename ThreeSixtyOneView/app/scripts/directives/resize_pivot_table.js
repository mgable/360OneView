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
                var containerHeight;
                var containerWidth;

                function adjustHeightOnResize() {

                    pivotBuilderHeight = $('#pivotBuilder').height() === pivotBuilderMinHeight ? pivotBuilderMinHeight : pivotBuilderMaxHeight;
                    pivotTableHeight   = $window.innerHeight - pivotBuilderHeight - 20;
                    containerHeight    = $window.innerHeight + 153 + 40;
                    $('.Scenario').height(containerHeight);
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                }

                $rootScope.$on(EVENTS.toggleBuilder, function(event, data){

                    var pivotBuilderHeight = data === "open" ? pivotBuilderMaxHeight : pivotBuilderMinHeight;
                    var pivotTableHeight = $window.innerHeight - pivotBuilderHeight - 20;
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
