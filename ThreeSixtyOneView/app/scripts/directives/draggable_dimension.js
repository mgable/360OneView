'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: 'views/directives/draggable_dimension.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                name: '=',
                close: '&clickClose'
            }
        };
    });