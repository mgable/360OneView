/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("msFilterInput", ["SortAndFilterService", function(SortAndFilterService) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "views/directives/ms_filter_input.tpl.html",
            controller: function($scope) {
                $scope.SortAndFilterService = SortAndFilterService;
            }
        };
    }]);