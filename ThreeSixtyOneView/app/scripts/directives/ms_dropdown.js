/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msDropdown', ["$document", "$timeout", "$rootScope", "$filter", "CONFIG", "DropdownService", "SortAndFilterService", "ViewService", "EVENTS", function($document, $timeout, $rootScope, $filter, CONFIG, DropdownService, SortAndFilterService, ViewService, EVENTS) {
        return {
            restrict: "AE",
            templateUrl: "views/directives/ms_dropdown.tpl.html",
            replace: true,
            scope: {
                selectedSortIndex: "@",
                isActive: "@",
                id: "@msid",
                reverse: "@",
                remove: "@"
            },
            controller: function($scope, $element, $attrs) {
                var dropdown = $($element).find('.ms-select-list'),
                    currentView = ViewService.getCurrentView(),
                    focusInput = function() {
                        var inputField = $element.find('input');
                        if (inputField) {
                            $timeout(function() {
                                inputField.focus();
                            });
                        }
                    },
                    close = function() {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    },
                    setOrderBy = function(item) {
                        $scope.selectedFilter = "";
                        DropdownService.setActive($scope.id);
                        SortAndFilterService.setFilter("reset", "", false);
                        SortAndFilterService.setFilter("orderBy", item.filter, true);
                        SortAndFilterService.setSorter($scope.id, item.label);
                    },
                    setFilterBy = function(item, who) {
                        var filter = {};
                        filter[item.filter] = $scope[who];

                        if (isActive() && item) {
                            SortAndFilterService.setFilter("reset", "", false);
                            SortAndFilterService.setFilter("filterBy", filter, true);
                        } else {
                            SortAndFilterService.setFilter("reset", "", true);
                        }
                    },
                    isActive = function() {
                        return $scope.id === DropdownService.getActive();
                    },
                    dontPassEvent = function(evt) {
                        if (evt) {
                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    };

                $document.on('keypress', function(event) {
                    if (event.keyCode === 13 && $scope.isActive && !$scope.enabledOn($scope.selectedFilter)) {
                        var menu = DropdownService.getActive(),
                            submitButton = $("#" + menu + " .submit-button");
                        $timeout(function() {
                            angular.element(submitButton).triggerHandler('click');
                        });
                    }
                });

                $rootScope.$on(EVENTS.resetFilterBy, function() {
                    $scope.selectedFilter = null;
                });

                $scope.dontPassEvent = dontPassEvent;
                $scope.DropdownService = DropdownService;
                $scope.filterBy = false;
                $scope.selectedFilter = null;
                $scope.me = CONFIG.user.name;
                $scope.name = "";
                $scope.reverse = $scope.reverse.bool();
                $scope.items = CONFIG.view[currentView].sortMenu.displayColumns;
                $scope.selectedItem = CONFIG.view[currentView].sortMenu.displayColumns[$scope.selectedSortIndex];

                SortAndFilterService.setSorter($scope.id, $scope.selectedItem.label);

                if ($scope.isActive) {
                    // ***
                   
                    DropdownService.setActive($scope.id);
                    SortAndFilterService.setFilter("orderBy", $scope.selectedItem.filter, false);
                }

                // determines if a menu selection has a related template
                $scope.enabledOn = function(which) {
                    return which ? ((which.label === $scope.selectedItem.enabledOn) ? false : true) : true;
                };


                $scope.submit = function(name) {
                    if (($scope.selectedFilter && $scope.selectedFilter.label === $scope.selectedItem.enabledOn) && (name === null || name === "")) {
                        window.alert("Please enter a name to filter");
                        focusInput();
                    } else {
                        $scope.name = name;
                        close();
                        setFilterBy($scope.selectedFilter, "name");
                    }
                };

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
                    $scope.filterBy = SortAndFilterService.hasFilterBy();
                    // ***
                    setOrderBy(item);
                };

                $scope.select = function(item) {

                    if (typeof $scope.reverse !== "boolean") {
                        $scope.reverse = $scope.reverse.bool();
                    }

                    if (!isActive()) {
                        $scope.selectedItem = item;
                        SortAndFilterService.setFilter("reverse", $scope.reverse, false);
                        // ***
                        setOrderBy(item);
                    } else {
                        $scope.reverse = !$scope.reverse;

                        // ***
                        SortAndFilterService.setFilter("reverse", $scope.reverse, true);
                    }
                };

                $scope.selectFilter = function(which) {
                    if (!$scope.enabledOn(which)) {
                        $document.off('click', close);
                    }

                    if (!$scope.enabledOn($scope.selectedFilter)) {
                        $document.on('click', close);
                    }

                    $scope.selectedFilter = ($scope.selectedFilter === which) ? "" : which;
                    if (which.label === $scope.selectedItem.enabledOn) {
                        focusInput();
                    }

                    // ***
                    setFilterBy($scope.selectedFilter, $scope.selectedFilter.who);
                    $scope.filterBy = SortAndFilterService.hasFilterBy();
                };
            }
        };
    }]);