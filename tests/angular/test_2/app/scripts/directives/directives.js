'use strict';

angular.module('filemanagerApp')
    .directive('fileManagementButtons', function() {
        return {
            replace: true,
            templateUrl: '/views/directives/fileManagementButtons.html',
            restrict: 'E',
        };
    }).directive('nav', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                scope.selectedIndex = (attrs['firstselected']) ? attrs['firstselected'] : -1;
                scope.radio = attrs['radio'];
            },
            controller: function($scope) {

                $scope.toggleSelected = function(index, subMenu) {
                    if (!$scope.modalOpen) {
                        if (subMenu) {
                            $scope.activeSubMenu = typeof subMenu === "boolean" ? index : subMenu;
                        } else {
                            $scope.activeSubMenu = false;
                        }

                        if (index !== $scope.selectedIndex) {
                            $scope.selectedIndex = index;
                        } else {
                            if ($scope.radio) {
                                return;
                            } else {
                                $scope.selectedIndex = -1;
                            }
                        }
                    }
                }

                $scope.getClass = function(index) {
                    return (index === $scope.selectedIndex) ? 'selected' : '';
                }
            }
        };
    })
    .directive('rename', function() {
        return {
            restrict: 'AE',
            link: function postLink(scope, element, attrs) {},
            transclude: true,
            controller: function($scope, $element, $attrs, $rootScope) {


                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    $rootScope.$broadcast("$close");
                };

                $scope.submit = function(evt) {
                    $scope.close(evt);

                    $scope.$emit('update', {
                        prop: 'title',
                        name: $scope.name,
                        id: $attrs['id']
                    });
                };

                $scope.cancel = function(evt) {
                    $scope.close(evt);
                }
            },
            //template: '<div><span ng-repeat="item in [1,2,3,]">{{item}}</span>hello <span ng-transclude></span></div>'
            templateUrl: '/views/directives/rename.html'
        };
    })
    .directive('sortingOptions', function() {
        return {
            restrict: 'AE',
        link: function postLink(scope, element, attrs, ctlr) {
            // no link function
        },
            replace: true,
            scope: true,
            require: "?sorter",
            controller: function($scope, $element, $attrs, $rootScope) {
                $scope.label = $attrs.label;
                $scope.reverse = false;

                $scope.sort = function(evt, which) {
                    console.info("sorting by " + which)
                    evt.stopPropagation();
                    evt.preventDefault();
                    if (which === $scope.orderBy) {
                        $scope.reverse = !$scope.reverse;
                    }
                    $scope.$parent.reverse = $scope.reverse;
                    $scope.sortBy(which);
                }
            },

            templateUrl: '/views/directives/sortingOptions.html'
        };
    }).directive('sorter', function() {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: '<div ng-transclude></div>',
            link: function postLink(scope, element, attrs) {
                scope.orderBy = attrs['orderby'];
                scope.reverse = false;
            },
            controller: function($scope, $element, $attrs) {

                $scope.sortBy = function(which) {
                    $scope.orderBy = which;
                }
            }
        }
    }).directive('setAsMaster', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/directives/setAsMaster.html',
            link: function(scope, element, attrs) {
                scope.text = attrs.text;
                scope.completedText = attrs["completedtext"];
                scope.completedTitle = attrs["completedtitle"];
                scope.callback = attrs['callback'];
                scope.callbackData = attrs['callbackdata'];
            },
            controller: function($scope, $element, $attrs, $rootScope, $timeout) {
                $scope.completed = false;

                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                };

                console.info($scope.data)


                $scope.submit = function(evt) {
                    console.info("submit");
                    $scope.close(evt);
                    $scope.completed = true;
                    $scope.setTitle($scope.completedTitle);

                    //TODO:  this is a very strong dependency
                    if ($scope.callback) {
                        $scope.$parent.$parent[$scope.callback]($scope.callbackData);
                    }

                    $timeout(function() {
                        $rootScope.$broadcast("$close")
                    }, 3000);
                };

                $scope.cancel = function(evt) {
                    console.info("cancel")
                    $scope.close(evt);
                    $rootScope.$broadcast("$close");
                }
            }
        }
    }).directive('triStateCheckbox', function() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                checkboxes: '='
            },
            template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
            controller: function($scope, $element, $attrs, filterFilter, filterService) {
                $scope.items = [];
                var self = this;

                this.getSelectedCheckBoxes = function() {
                    return $scope.items;
                }

                // reset delete files on filter change
                $scope.$on("$filter", function() {
                    console.info("filetr")
                    $scope.masterChange();
                })

                $scope.masterChange = function() {
                    $scope.items = [];
                    if ($scope.master) {
                        angular.forEach(filterFilter($scope.checkboxes, filterService.activeFilters), function(cb, index) {
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
    }).directive('deleteServiceForCheckbox', function(GroupFileDelete) {
        return {
            restrict: "A",
            require: "triStateCheckbox",
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(ctrl.getSelectedCheckBoxes, function() {
                    GroupFileDelete.setFilesToDelete(ctrl.getSelectedCheckBoxes())
                });
                scope.$watch(GroupFileDelete.getReset, function() {
                    ctrl.reset();
                    GroupFileDelete.resetReset();
                });
            }
        }
    });