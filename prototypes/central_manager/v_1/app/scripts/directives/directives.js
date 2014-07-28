/*jshint  quotmark: false, unused: false */
'use strict';

angular.module('centralManagerApp')
    .directive('msDropdown', function($document, $timeout, $rootScope, DROPDOWNITEMS, DropdownService, SortAndFilterService, $filter) {
        return {
            restrict: "AE",
            templateUrl: "/msDropdown.html",
            replace: true,
            scope: {
                selectedSortIndex: "@",
                isActive: "@",
                id: "@msid",
                reverse: "@"
            },
            controller: function($scope, $element, $attrs) {
                $scope.reverse = $scope.reverse.bool();

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
                        $scope.selectedFilter = "";
                        DropdownService.setActive($scope.id);
                        SortAndFilterService.setFilter("reset", "", false);
                        SortAndFilterService.setFilter("orderBy", item.label, true);
                        SortAndFilterService.setSorter($scope.id, item.label);
                    },
                    setFilterBy = function(item, who) {
                        if (isActive() && item) {
                            SortAndFilterService.setFilter("reset", "", false);
                            SortAndFilterService.setFilter("filterBy", {
                                filter: item.filter,
                                value: who
                            }, true);
                        } else {
                            SortAndFilterService.setFilter("reset", "", true);
                        }
                    },
                    setAsActive = function(id) {
                        DropdownService.setActive(id);
                        setOrderBy($scope.selectedItem);
                        setFilterBy($scope.selectedFilter, getName($scope.selectedFilter));
                    },
                    getName = function(filter) {
                        if (filter) {
                            return (filter.label.indexOf('by me') > -1) ? $scope.me : $scope.name ? $scope.name : true;
                        }
                        return true;
                    },
                    isActive = function() {
                        return $scope.id === DropdownService.getActive();
                    },
                    dontPassEvent = function(evt) {
                        if (evt) {
                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    }

                $scope.dontPassEvent = dontPassEvent;

                $document.on('keypress', function(event) {
                    if (event.keyCode == 13 && $scope.isActive && !$scope.enabledOn($scope.selectedFilter)) {
                        var menu = DropdownService.getActive(),
                            submitButton = $("#" + menu + " .submit-button")
                        $timeout(function() {
                            angular.element(submitButton).triggerHandler('click');
                        })
                    }
                })

                $rootScope.$on("SortAndFilterService:resetFilterBy", function() {
                    $scope.selectedFilter = null;
                });

                $scope.DropdownService = DropdownService;
                $scope.items = DROPDOWNITEMS;

                $scope.selectedItem = DROPDOWNITEMS[$scope.selectedSortIndex];
                $scope.selectedFilter = null;
                $scope.me = "Fred Flintstone";
                $scope.name = "";

                SortAndFilterService.setSorter($scope.id, $scope.selectedItem.label);

                if ($scope.isActive) {
                    // ***
                    DropdownService.setActive($scope.id);
                    SortAndFilterService.setFilter("orderBy", $scope.selectedItem.label, false);
                }

                $scope.enabledOn = function(which) {
                    return which ? ((which.label === $scope.selectedItem.enabledOn) ? false : true) : true;
                }


                $scope.submit = function(name) {
                    if (($scope.selectedFilter.label === $scope.selectedItem.enabledOn) && (name === null || name === "")) {
                        alert("Please enter a name to filter");
                        focusInput();
                    } else {
                        $scope.name = name;
                        console.info("submitted: " + $scope.name);
                        close();

                        // ***
                        setFilterBy($scope.selectedFilter, $scope.name);
                    }
                }

                $scope.toggle = function(id) {
                    if (dropdown.hasClass('hide')) {
                        dropdown.removeClass('hide');

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

                $scope.select = function(item) {

                    if (typeof $scope.reverse !== "boolean") {
                        $scope.reverse = $scope.reverse.bool()
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

                    console.info("$scope.selectedFilter is ")
                    console.info($scope.selectedFilter)

                    // ***
                    setFilterBy($scope.selectedFilter, getName($scope.selectedFilter));
                }
            }
        }
    })
    .directive('msLinkGroup', function($timeout) {
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                $timeout(function() {
                    $scope.selectedItem = $attrs.firstselected || 'none';
                })

                $scope.radio = $attrs.radio || false;
                $scope.enabled = true;

                this.toggleSelected = function(event) {
                    var item = event.data.label;
                    $scope.$apply(
                        function() {
                            if ($scope.enabled) {
                                if (item !== $scope.selectedItem) {
                                    $scope.selectedItem = item;
                                } else if (!$scope.radio) {
                                    $scope.selectedItem = 'none';
                                }
                            }
                        }
                    );
                };

            }

        };
    }).directive("msLink", function() {
        return {
            restrict: "A",
            require: "^msLinkGroup",
            link: function(scope, element, attrs, ctrl) {
                element.on('click', {
                    label: attrs.msLink
                }, ctrl.toggleSelected)

            }
        }
    }).directive("msSetActiveItem", function(ActiveSelection) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                console.info(attrs.msSetActiveItem);
                element.on('click', {
                    item: attrs.msSetActiveItem
                }, ActiveSelection.setActiveItem);
            }
        }
    })
    .directive('sortingOptions', function(SortAndFilterService) {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            require: "^sorter",
            link: function($scope, $element, $attrs, ctrl) {
                $scope.label = $attrs.label;
                $scope.display = $attrs.display;
                $scope.id = $attrs.msid;
                $scope.reverse = false;
                $scope.SortAndFilterService = SortAndFilterService;

                $scope.sort = function(evt, which) {
                    console.info("sorting " + which)
                    console.info("order by " + $scope.SortAndFilterService.getOrderBy())

                    if (evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                    if (which === $scope.SortAndFilterService.getOrderBy()) {
                        $scope.reverse = !$scope.reverse;
                    } else {
                        ctrl.setOrderBy(which, $scope.id, false);
                    }
                    ctrl.setReverse($scope.reverse, true);
                };
            },
            templateUrl: '/views/directives/sortingOptions.html'
        };
    })
    .directive('sorter', function(SortAndFilterService, DropdownService) {
        return {
            restrict: "E",
            replace: true,
            controller: function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs.orderby;
                this.setOrderBy = function(which, id, filter) {
                    console.info("setting order by " + which)
                    SortAndFilterService.setFilter("orderBy", which, filter);
                    DropdownService.setActive(id);
                };
                this.setReverse = function(reverse, filter) {
                    console.info("setting revere to", reverse, filter)
                    SortAndFilterService.setFilter("reverse", reverse, filter);
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
            controller: function($scope, $element, $attrs, filterFilter, SortAndFilterService) {
                $scope.items = [];
                var self = this;

                this.getSelectedCheckBoxes = function() {
                    return $scope.items;
                };

                // reset delete files on filter change
                $scope.$on("SortAndFilterService:filter", function() {
                    $scope.masterChange();
                })

                $scope.masterChange = function() {
                    $scope.items = [];
                    if ($scope.master) {
                        angular.forEach(filterFilter($scope.checkboxes, SortAndFilterService.getActiveFilters()), function(cb, index) {
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
    }).directive('sortableColumns', function() {
        return {
            template: '<div ng-switch on="displayBy" class="text-holder">' +
                '<span ng-switch-when="Last Modified">{{item.lastModified | timeago }}</span>' +
                '<span ng-switch-when="Modified By">{{item.modifiedBy}}</span>' +
                '<span ng-switch-when="Type">{{item.type}}</span>' +
                '<span ng-switch-when="Owner">{{item.owner}}</span>' +
                '<span ng-switch-when="Defaults">{{item.defaults}}</span>' +
                '<span ng-switch-default>FAIL</span>' +
                '</div>',
            restrict: "AE",
            replace: true,
            scope: {
                item: '=',
                displayBy: '='
            }
        }
    }).directive('focus', function($timeout) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                console.info(element);
                $timeout(function() {
                    element[0].focus();
                }, 300)
            }
        }
    }).directive('search', function($timeout, SortAndFilterService) {
        return {
            template: '<span><i class="fa fa-search" ng-click="toggleSearchField()"></i>&nbsp;<span ng-show="searchVisible" class="search-holder"><input type="text" class="search-input" ng-model="SortAndFilterService.searchText" ng-change="SortAndFilterService.filter()"/>&nbsp<a ng-click="toggleSearchField()" class="close-button"><i class="fa fa-times"></i></a></span></span>',
            restrict: "AE",
            replace: true,
            link: function($scope, $element, $attrs) {
                var inputField = $element.find("input");
                $scope.searchVisible = false;

                $scope.toggleSearchField = function() {
                    if ($scope.searchVisible) {
                        $scope.SortAndFilterService.searchText = "";
                    } else {
                        $timeout(function() {
                            inputField[0].focus();
                        }, 300);
                    }
                    $scope.searchVisible = !$scope.searchVisible
                }
            }
        }
    }).directive('inlineRename', function(FilesModel) {
        return {
            template: '<h4 ng-hide="isActive">{{item.title}}&nbsp;<a ng-click="action()"><i class="fa fa-pencil"></i></a></h4>' +
                '<h4 ng-show="isActive"><input ng-model="item.title" type="text"></input>&nbsp;<a ng-click="submit()"><i class="fa fa-check"></i></a>&nbsp;<a ng-click="cancel()"><i class="fa fa-times"></i></a></h4>',
            restrict: 'E',
            scope: {
                item: "=",
                // action: "&"
            },
            controller: function($scope, $element, $attrs) {
                var temp;

                $scope.isActive = false;
                $scope.action = function() {
                    if (!$scope.isActive) {
                        temp = $scope.item.title;
                        $scope.isActive = true;
                    } else {
                        $scope.isActive = false;
                    }
                }

                $scope.submit = function() {
                    FilesModel.$set($scope.item);
                    $scope.isActive = false;
                }

                $scope.cancel = function() {
                    $scope.item.title = temp;
                    $scope.isActive = false;
                }
            }
        };
    });