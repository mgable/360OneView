/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('sortableColumns', [function() {
        return {
            templateUrl: 'views/directives/sortable_columns.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                item: '=',
                displayBy: '='
            }
        };
    }]);