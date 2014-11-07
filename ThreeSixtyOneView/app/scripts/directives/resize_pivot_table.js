/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive("scrollPivotTable", function($window) {
        return function(scope) {

                function adjustHeightOnResize() {

                    var pivotBuilderHeight = scope.pbShow ? 244 : 33;
                    var pivotTableHeight = window.innerHeight - pivotBuilderHeight - 20;
                    var containerHeight = window.innerHeight + 153 + 40;
                    $('.scenario-edit').height(containerHeight);
                    $('#spreadjs').height(pivotTableHeight);
                    $('#spreadjs').wijspread('refresh');

                }

                scope.adjustHeightOnClick = function() {

                    var pivotBuilderHeight = $('#pivotBuilder').height() === 33 ? 244 : 33;
                    var height = window.innerHeight - pivotBuilderHeight - 20;
                    $('#spreadjs').height(height);
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
