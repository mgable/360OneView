'use strict';

angular.module('fileManagerApp')
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
                }
                scope.$on('linkGroup', function(event, state) {
                    scope.enabled = state;
                });
            }

        };
    })
    .directive('popoverContent', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/directives/popoverTemplate.html',
            controller: function($scope, $element, $attrs, $timeout, $rootScope) {
                $scope.completed = false;
                $rootScope.$broadcast('linkGroup', false);

                angular.extend($scope, msFilterObjByFn($attrs, function(prop) {
                    return !/^\$/.test(prop);
                }));

                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    $rootScope.$broadcast('linkGroup', true);
                    $rootScope.$broadcast('fileManagementButton', false);
                };

                $scope.submit = function(evt) {
                    $scope.close(evt);
                    $scope.completed = true;
                    $scope.setTitle($scope.completedtitle);

                    //TODO:  this is a very strong dependency
                    if ($scope.callback) {
                        $scope.$parent.$parent[$scope.callback]($scope.callbackdata);
                    }

                    $timeout(function() {
                        $scope.$emit('$close');
                    }, 3000);
                };

                $scope.cancel = function(evt) {
                    $scope.close(evt);
                    $scope.$emit('$close');
                };
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
                $scope.reverse = false;

                $scope.sort = function(evt, which) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    if (which === $scope.orderBy) {
                        $scope.reverse = !$scope.reverse;
                    }
                    ctrl.setReverse($scope.reverse);
                    ctrl.setOrderBy(which);
                }
            },
            templateUrl: '/views/directives/sortingOptions.html'
        };
    })
    .directive('sorter', function() {
        return {
            restrict: "E",
            replace: true,
            controller: function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs['orderby'];
                this.setOrderBy = function(which) {
                    $scope.orderBy = which;
                }
                this.setReverse = function(reverse) {
                    $scope.reverse = reverse;
                }
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
            controller: function($scope, $element, $attrs, filterFilter, FilterService) {
                $scope.items = [];
                var self = this;

                this.getSelectedCheckBoxes = function() {
                    return $scope.items;
                }

                // reset delete files on filter change
                $scope.$on("$filter", function() {
                    $scope.masterChange();
                })

                $scope.masterChange = function() {
                    $scope.items = [];
                    if ($scope.master) {
                        angular.forEach(filterFilter($scope.checkboxes, FilterService.activeFilters), function(cb, index) {
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
                    })

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
                    FileDeleteService.setFilesToDelete(ctrl.getSelectedCheckBoxes())
                });
                scope.$watch(FileDeleteService.getReset, function() {
                    ctrl.reset();
                    FileDeleteService.resetReset();
                });
            }
        }
    })
    .directive('rename', function() {
        return {
            restrict: 'AE',
            replace: true,
            controller: function($scope, $element, $attrs, $rootScope, FilesModel) {
                $rootScope.$broadcast('linkGroup', false);

                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    $rootScope.$broadcast('linkGroup', true);
                    $rootScope.$broadcast("$close");
                };

                $scope.submit = function(evt) {
                    $scope.close(evt);
                    FilesModel.update({
                        prop: 'title',
                        value: $scope.name,
                        id: $attrs['id']
                    });
                };

                $scope.cancel = function(evt) {
                    $scope.close(evt);
                };
            },
            templateUrl: '/views/directives/rename.html'
        };
    })
    .directive('fileManagementButtons', function() {
        return {
            replace: true,
            templateUrl: '/views/directives/fileManagementButtons.html',
            restrict: 'E',
            controller: function($scope, $element, $attrs) {
                $scope.active = false;
                $scope.setActive = function(trueOrFalse) {
                    $scope.active = trueOrFalse;
                }

                $scope.$on('fileManagementButton', function(event, data) {
                    $scope.setActive(data);
                });
            }
        };
    });