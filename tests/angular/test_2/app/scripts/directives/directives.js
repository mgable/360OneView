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
                // element.text('this is the nav directive');
                //console.info(attrs['firstselected']);
                scope.selectedIndex = (attrs['firstselected']) ? attrs['firstselected'] : -1;
                scope.radio = attrs['radio'];
            },
            controller: function($scope) {

                $scope.toggleSelected = function(index, subMenu) {
                    console.info($scope.radio);
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
            link: function postLink(scope, element, attrs) {
                // console.info("test directive");

            },
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
                    console.info("I am sorting on " + which);
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
            },
            controller: function($scope, $element, $attrs, $rootScope, $timeout) {
                $scope.completed = false;

                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                };

                $scope.submit = function(evt) {
                    $scope.close(evt);
                    $scope.completed = true;
                    $scope.setTitle($scope.completedTitle);
                    $timeout(function() {
                        $rootScope.$broadcast("$close")
                    }, 3000);
                };

                $scope.cancel = function(evt) {
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
            controller: function($scope, $element, GroupDelete) {
                $scope.masterChange = function() {
                    $scope.totalSelected = 0;
                    $scope.files = [];
                    if ($scope.master) {
                        angular.forEach($scope.checkboxes, function(cb, index) {
                            cb.isSelected = true;
                            $scope.totalSelected++
                            $scope.files.push(cb);
                        });
                    } else {
                        angular.forEach($scope.checkboxes, function(cb, index) {
                            cb.isSelected = false;
                        });
                    }
                    // console.info("the total selected is " + $scope.totalSelected);
                    GroupDelete.setDeleteCount($scope.totalSelected);
                    GroupDelete.setFilesToDelete($scope.files);
                };
                $scope.$watch('checkboxes', function() {
                    var allSet = true,
                        allClear = true;

                    $scope.totalSelected = 0;
                    $scope.files = [];
                    angular.forEach($scope.checkboxes, function(cb, index) {
                        if (cb.isSelected) {
                            $scope.totalSelected++;
                            $scope.files.push(cb);
                            allClear = false;
                        } else {
                            allSet = false;
                        }
                        //console.info("the total selected is " + $scope.totalSelected);
                    });

                    GroupDelete.setDeleteCount($scope.totalSelected);
                    GroupDelete.setFilesToDelete($scope.files);

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
    });