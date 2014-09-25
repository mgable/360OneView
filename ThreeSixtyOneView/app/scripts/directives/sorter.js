/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('sorter', ["SortAndFilterService", "DropdownService", function(SortAndFilterService, DropdownService) {
        return {
            restrict: "AE",
            controller: function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs.orderby;
                this.setOrderBy = function(which, id, filter) {
                    SortAndFilterService.setFilter("orderBy", which, filter);
                    DropdownService.setActive(id);
                };
                this.setReverse = function(reverse, filter) {
                    SortAndFilterService.setFilter("reverse", reverse, filter);
                };
            }
        };
    }]);