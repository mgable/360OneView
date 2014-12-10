/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msDropdown', ["$document", "$timeout", "$state", "$rootScope", "$filter", "CONFIG", "DropdownService", "SortAndFilterService", "EVENTS", function($document, $timeout, $state, $rootScope, $filter, CONFIG, DropdownService, SortAndFilterService, EVENTS) {
        return {
            restrict: "AE",
            templateUrl: "views/directives/ms_dropdown.tpl.html",
            replace: true,
            scope: {
                isActive: "@",
                id: "@msid",
                reverse: "@"
            },
            controller: function($scope, $element, $attrs) {
                var dropdown = $($element).find('.ms-select-list'),
                    currentView = $state.current.name,
                    close = function() {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    },
                    setOrderBy = function(item) {
                        DropdownService.setActive($scope.id);
                        SortAndFilterService.setFilter("reset", "", false);
                        SortAndFilterService.setFilter("orderBy", item.filter, true);
                        SortAndFilterService.setSorter($scope.id, item.label);
                    },
                    isActive = function() {
                        return $scope.id === DropdownService.getActive();
                    };

                $scope.DropdownService = DropdownService;
                $scope.reverse = $scope.reverse.bool();

                $scope.items = CONFIG.view[currentView].sortMenu.displayColumns;
                $scope.selectedItem = CONFIG.view[currentView].sortMenu.displayColumns[0];

                SortAndFilterService.setSorter($scope.id, $scope.selectedItem.label);

                if ($scope.isActive) {
                    DropdownService.setActive($scope.id);
                    SortAndFilterService.setFilter("orderBy", $scope.selectedItem.filter, false);
                }


                $scope.toggle = function() {
                    if (dropdown.hasClass('hide')) {
                        dropdown.removeClass('hide');

                        $timeout(function() {
                            $document.on('click', close);
                        });
                    } else {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    }
                };

                $scope.selectSort = function(item) {
                    $scope.selectedItem = item;
                    SortAndFilterService.setFilter("reset", "", false);
                    setOrderBy(item);
                };

                $scope.select = function(item) {

                    if (typeof $scope.reverse !== "boolean") {
                        $scope.reverse = $scope.reverse.bool();
                    }

                    if (!isActive()) {
                        $scope.selectedItem = item;
                        SortAndFilterService.setFilter("reverse", $scope.reverse, false);
                        setOrderBy(item);
                    } else {
                        $scope.reverse = !$scope.reverse;
                        SortAndFilterService.setFilter("reverse", $scope.reverse, true);
                    }
                };
            }
        };
    }]);