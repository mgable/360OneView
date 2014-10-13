/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('search', ["$timeout", "SortAndFilterService", function($timeout, SortAndFilterService) {
        return {
            template: '<span><span class="toggle" ng-click="toggleSearchField()"><icon type="search"></icon></span>&nbsp;<span ng-show="searchVisible" class="search-holder"><input type="text" class="search-input" ng-model="SortAndFilterService.searchText" ng-change="SortAndFilterService.filter()"/>&nbsp<a ng-click="toggleSearchField()" class="close-button"><i class="fa fa-times"></i></a></span></span>',
            restrict: "AE",
            replace: true,
            link: function($scope, $element, $attrs) {
                var inputField = $element.find("input");
                $scope.searchVisible = false;
                $scope.SortAndFilterService = SortAndFilterService;

                $scope.toggleSearchField = function() {
                    if ($scope.searchVisible) {
                        SortAndFilterService.resetSearchText();
                    } else {
                        $timeout(function() {
                            inputField[0].focus();
                        }, 300);
                    }
                    $scope.searchVisible = !$scope.searchVisible;
                };

                $scope.$on("$stateChangeSuccess", SortAndFilterService.resetSearchText());
            }
        };
    }]);