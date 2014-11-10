/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive("scrollPivotTable", function($window) {
        return function(scope) {

                var pivotBuilderMaxHeight = 222;
                var pivotBuilderMinHeight = 33;
                var pivotBuilderHeight    = pivotBuilderMaxHeight;
                var pivotTableHeight, containerHeight;

                function adjustHeightOnResize() {

                    pivotBuilderHeight = $('#pivotBuilder').height() === pivotBuilderMinHeight ? pivotBuilderMinHeight : pivotBuilderMaxHeight;
                    pivotTableHeight = window.innerHeight - pivotBuilderHeight - 20;
                    containerHeight = window.innerHeight + 153 + 40;
                    $('.scenario-edit').height(containerHeight);
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                }

                scope.adjustHeightOnClick = function() {

                    var pivotBuilderHeight = $('.pbTitle').hasClass('pbTitleSel') ? pivotBuilderMinHeight : pivotBuilderMaxHeight;
                    var pivotTableHeight = window.innerHeight - pivotBuilderHeight - 20;
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                };

                // Call to the function when the page is first loaded
                adjustHeightOnResize();

                angular.element($window).bind('resize', function() {

                    adjustHeightOnResize();
                    scope.$apply();

                });

        };
    });
