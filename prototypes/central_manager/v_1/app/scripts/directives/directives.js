/*jshint  quotmark: false, unused: false */
'use strict';

angular.module('centralManagerApp')
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
    .directive('sorter', function() {
        return {
            restrict: "E",
            replace: true,
            controller: function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs.orderby;
                this.setOrderBy = function(which) {
                    $scope.orderBy = which;
                };
                this.setReverse = function(reverse) {
                    $scope.reverse = reverse;
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