'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, FilesModel, SEARCHITEMS, FilterService, FileDeleteService, SelectionService, $filter) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
        $scope.seeAll = false;
        $scope.FilterService = FilterService;
        $scope.FilterService.activeFilters.search = $scope.menuItems[0].label;
        $scope.selectedCategory = $scope.menuItems[0].label;
        $scope.enableDisplayActions = false;
        $scope.SelectionService = SelectionService;

        $scope.$on("orderBy", function() {
            console.info("received orderby event")
            $scope.orderBy = $filter('camelCase')(SelectionService.getOrderBy());
            console.info($scope.orderBy)
        })

        $scope.toggleInfoTray = function() {
            $scope.showinfotray = !$scope.showinfotray;
        };

        $scope.$on('FileDeleteService:change', function() {
            $scope.enableDisplayActions = FileDeleteService.getFileCount();
        });

        $scope.alert = function(msg) {
            alert(msg);
        }

        $scope.setFilter = function(filter, other) {
            $scope.selectedCategory = other ? (typeof other === "boolean" ? filter : other) : filter;

            if (other) {
                FilterService.activeFilters.search = filter;
                FilterService.activeFilters.type = (typeof other === 'string') ? other : '';
            } else {
                FilterService.activeFilters.search = '';
                FilterService.activeFilters.type = filter === 'All' ? '' : filter;
            }
            $rootScope.$broadcast('$filter');
        }
    }).filter('correctLabel', function() {
        return function(input) {
            if (input === "Owner") return "Owned by";
            return input
        }
    })
    .directive('msDropdown', function($document, $timeout, $rootScope, SelectionService, FilterService) {
        return {
            restrict: "AE",
            templateUrl: "/tpl.html",
            replace: true,
            scope: {
                selected: "@",
                index: "@",
                active: "@"
            },
            controller: function($scope, $element, $attrs) {
                var inputField = ($element.find('input'));
                $scope.items = ["Last Modified", "Modified by", "Type", "Owner", "Defaults"];
                //$scope.selected = $scope.items[0];
                $scope.reverse = false;
                $scope.filtered = '';
                $scope.name;
                $scope.isActive = false;
                $scope.SelectionService = SelectionService;


                var dropdown = $($element).find('.ms-select-list'),
                    toggle = function(evt) {
                        $scope.dontPassEvent(evt);

                        if ($scope.isActive) $scope.toggle(evt);
                    },

                    apply = function(evt) {
                        $scope.dontPassEvent(evt);

                        if ($scope.isActive) $scope.apply(evt);
                    },
                    setSelected = function(which) {
                        SelectionService.setSelectedItems($scope.index, which);
                        if ($scope.active) {
                            SelectionService.setActive($scope.index)
                            SelectionService.setOrderBy($scope.selected)
                        }
                    }
                setSelected($scope.selected);

                $document.on('click', apply);

                $document.on('keydown', function(evt) {
                    if (evt.keyCode === 13 && $scope.isActive) $scope.apply(evt);
                });

                $scope.dontPassEvent = function(evt) {
                    if (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                }

                $scope.setReverse = function() {
                    $scope.reverse = !$scope.reverse;
                    SelectionService.setReverse($scope.reverse);
                }

                $scope.apply = function(evt) {
                    if (($scope.filtered === "Modified by" || $scope.filtered === "Owned by") && (typeof $scope.name == "undefined" || $scope.name === "")) {
                        $scope.dontPassEvent(evt);
                        alert("Please enter a name to filter");
                        inputField.focus();
                    } else {
                        if ($scope.filtered === "Modified by Me") {
                            FilterService.filterBy = {
                                modifiedBy: "Barney Rubble"
                            };
                        } else if ($scope.filtered === "Modified by") {
                            FilterService.filterBy = {
                                modifiedBy: $scope.name
                            };
                        } else if ($scope.filtered === "Owner") {
                            FilterService.filterBy = {
                                owner: $scope.name
                            };
                        } else if ($scope.filtered === "Owner Me") {
                            FilterService.filterBy = {
                                owner: "Barney Rubble"
                            };
                        } else {
                            FilterService.filterBy = "";
                        }
                        $scope.toggle(evt);
                    }
                }

                $scope.$on("toggle", function(evt, index) {
                    if ($scope.index !== index) {
                        if (!dropdown.hasClass('hide')) {
                            dropdown.addClass('hide');
                        }
                    } else {
                        //$scope.apply();
                    }
                });

                $scope.toggle = function(evt, index) {
                    $scope.dontPassEvent(evt);
                    $rootScope.$broadcast("toggle", index);


                    if (dropdown.hasClass('hide')) {
                        dropdown.removeClass('hide')
                        $scope.isActive = true;
                        SelectionService.setActive(index);
                    } else {
                        dropdown.addClass('hide');
                        $scope.isActive = false;
                    }
                }

                $scope.select = function(which, index) {
                    console.info(which)
                    $scope.selected = which;
                    setSelected(which);
                    $scope.toggle(false, index);
                }

                $scope.filter = function(evt, which) {
                    console.info("filtering")
                    $scope.filtered = ($scope.filtered === which) ? "" : which;

                    if ($scope.filtered === "") {
                        FilterService.filterBy = "";
                    }

                    if (which === "Modified by" || which == "Owner") {
                        $timeout(function() {
                            inputField.focus()
                        });
                    }
                    $scope.dontPassEvent(evt);
                }
            }
        }
    })