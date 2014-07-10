/*jshint  quotmark: false, unused: false */
'use strict';

angular.module('centralManagerApp')
    .directive('msDropdown', function($document, $timeout, DROPDOWNITEMS, DropdownService, SortAndFilterService) {
        return {
            restrict: "AE",
            templateUrl: "/tpl.html",
            replace: true,
            scope: {
                selectedSortIndex: "@",
                isActive: "@",
                id: "@"
            },
            controller: function($scope, $element, $attrs) {
                var dropdown = $($element).find('.ms-select-list'),
                    focusInput = function() {
                        var inputField = $element.find('input');
                        if (inputField) {
                            $timeout(function() {
                                inputField.focus()
                            });
                        }
                    },
                    close = function() {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    },
                    setOrderBy = function(item) {
                        SortAndFilterService.setOrderBy(item.label);
                        SortAndFilterService.setSorter($scope.id, item.label);
                    },
                    setReverse = function(reverse) {
                        if (isActive()) {
                            SortAndFilterService.setReverse(reverse);
                        }
                    },
                    setFilterBy = function(item, who) {
                        console.info("setFilterBy");
                        console.info(item, who)
                        SortAndFilterService.filterBy = {};
                        if (isActive() && item) {
                            SortAndFilterService.setFilterBy(item.label, who);
                        }
                    },
                    setAsActive = function(id) {
                        DropdownService.setActive(id);
                        setOrderBy($scope.selectedItem);
                        setReverse($scope.reverse);
                        setFilterBy($scope.selectedFilter, $scope.name);
                    },

                    isActive = function() {
                        return $scope.id === DropdownService.getActive();
                    }

                $scope.DropdownService = DropdownService;
                $scope.items = DROPDOWNITEMS;
                $scope.reverse = false;
                $scope.selectedItem = DROPDOWNITEMS[$scope.selectedSortIndex]
                $scope.selectedFilter = null;
                $scope.me = "Barney Rubble";
                $scope.name = "";

                SortAndFilterService.setSorter($scope.id, $scope.selectedItem.label);

                if ($scope.isActive) {
                    // ***
                    DropdownService.setActive($scope.id);
                    SortAndFilterService.setOrderBy($scope.selectedItem.label);
                }

                $scope.enabledOn = function(which) {
                    return which ? ((which.label === $scope.selectedItem.enabledOn) ? false : true) : true;
                }

                $scope.setReverse = function() {
                    $scope.reverse = !$scope.reverse;

                    // ***
                    setReverse($scope.reverse)
                }

                $scope.submit = function(name) {
                    if (($scope.selectedFilter.label === $scope.selectedItem.enabledOn) && (name === null || name === "")) {
                        alert("Please enter a name to filter");
                        focusInput();
                    } else {
                        $scope.name = name;
                        console.info("subbmitted: " + $scope.name);
                        close();

                        // ***
                        setFilterBy($scope.selectedFilter, $scope.name);
                    }
                }

                $scope.toggle = function(id) {
                    if (dropdown.hasClass('hide')) {
                        dropdown.removeClass('hide');

                        // ***
                        setAsActive(id);
                        $timeout(function() {
                            $document.on('click', close);
                        });
                    } else {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    }
                }

                $scope.selectSort = function(item) {
                    $scope.selectedItem = item;

                    // ***
                    setOrderBy(item);
                }

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
                    setFilterBy($scope.selectedFilter, $scope.me);
                }
            }
        }
    })
    .directive('groupDelete', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<span class="delete" ng-disabled="filesToDeleteCount === 0"><i class="icon-trash"></i>&nbsp;Delete ({{filesToDeleteCount || 0}})</span>',
            controller: function($scope, FileDeleteService) {
                $scope.filesToDeleteCount = FileDeleteService.getFileCount();

                // Multiple file delete file count
                $scope.$on("FileDeleteService:change", function() {
                    $scope.filesToDeleteCount = FileDeleteService.getFileCount();
                });
            }
        };
    })
    .directive('linkGroup', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.selectedItem = attrs.firstselected || 'none';
                scope.radio = attrs.radio || false;
                scope.activeSubMenu = false;
                scope.enabled = true;

                scope.toggleSelected = function(item, subMenu) {
                    if (scope.enabled) {
                        if (subMenu) {
                            scope.activeSubMenu = typeof subMenu === 'boolean' ? item : subMenu;
                        } else {
                            scope.activeSubMenu = false;
                        }

                        if (item !== scope.selectedItem) {
                            scope.selectedItem = item;
                        } else if (!scope.radio) {
                            scope.selectedItem = 'none';
                        }
                    }
                };
                scope.$on('linkGroup', function(event, state) {
                    scope.enabled = state;
                });
            }

        };
    })
    .directive('sortingOptions', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            require: "^sorter",
            link: function($scope, $element, $attrs, ctrl) {
                $scope.label = $attrs.label;
                $scope.display = $attrs.display;
                $scope.reverse = false;

                $scope.sort = function(evt, which) {
                    if (evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                    if (which === $scope.orderBy) {
                        $scope.reverse = !$scope.reverse;
                    }
                    ctrl.setReverse($scope.reverse);
                    ctrl.setOrderBy(which);
                    //ctrl.sort(which, $scope.reverse);
                };
            },
            templateUrl: '/views/directives/sortingOptions.html'
        };
    })
    .directive('sorter', function(SortAndFilterService) {
        return {
            restrict: "E",
            replace: true,
            controller: function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs.orderby;
                this.setOrderBy = function(which) {
                    console.info("setting order by")
                    SortAndFilterService.setOrderBy(which);
                };
                this.setReverse = function(reverse) {
                    SortAndFilterService.setReverse(reverse);
                };
            }
        };
    })
    .directive('triStateCheckbox', function() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                checkboxes: '='
            },
            template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
            controller: function($scope, $element, $attrs) {
                $scope.items = [];
                var self = this;

                this.getSelectedCheckBoxes = function() {
                    return $scope.items;
                };

                $scope.masterChange = function() {
                    $scope.items = [];
                    if ($scope.master) {
                        angular.forEach($scope.checkboxes, function(cb, index) {
                            cb.isSelected = true;
                            $scope.items.push(cb);
                        });
                    } else {
                        angular.forEach($scope.checkboxes, function(cb, index) {
                            cb.isSelected = false;
                        });
                    }
                };

                this.reset = function() {
                    angular.forEach($scope.checkboxes, function(cb, index) {
                        cb.isSelected = false;
                    });
                };

                $scope.$watch('checkboxes', function() {
                    $scope.items = [];
                    var allSet = true,
                        allClear = true;
                    self.items = [];
                    angular.forEach($scope.checkboxes, function(cb, index) {
                        if (cb.isSelected) {
                            $scope.items.push(cb);
                            allClear = false;
                        } else {
                            allSet = false;
                        }
                    });

                    if (allSet) {
                        $scope.master = true;
                        $element.prop('indeterminate', false);
                    } else if (allClear) {
                        $scope.master = false;
                        $element.prop('indeterminate', false);
                    } else {
                        $scope.master = false;
                        $element.prop('indeterminate', true);
                    }

                }, true);
            }
        };
    })
    .directive('deleteServiceForCheckbox', function(FileDeleteService) {
        return {
            restrict: "A",
            require: "triStateCheckbox",
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(ctrl.getSelectedCheckBoxes, function() {
                    FileDeleteService.setFilesToDelete(ctrl.getSelectedCheckBoxes());
                });
                scope.$watch(FileDeleteService.getReset, function() {
                    ctrl.reset();
                    FileDeleteService.resetReset();
                });
            }
        };
    });