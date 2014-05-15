'use strict';

angular.module('filemanagerApp')
    .directive('fileManagementButtons', function() {
        return {
            templateUrl: '/views/directives/fileManagementButtons.html',
            restrict: 'E',
        };
    }).directive('nav', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                // element.text('this is the nav directive');
                //console.info(attrs['firstselected']);
                scope.selectedIndex = (attrs['firstselected']) ? 0 : -1;
            },
            controller: function($scope) {

                $scope.toggleSelected = function(index) {

                    if (!$scope.modalOpen) {
                        if (index !== $scope.selectedIndex) {
                            $scope.selectedIndex = index;
                        } else {
                            $scope.selectedIndex = -1;
                        }
                    }
                }

                $scope.getClass = function(index) {
                    if (index === $scope.selectedIndex) {
                        return 'selected';
                    } else {
                        return '';
                    }
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
                    console.info("submit");
                    $scope.close(evt);

                    $scope.$emit('update', {
                        name: $scope.name,
                        id: $attrs['id']
                    });
                };

                $scope.cancel = function(evt) {
                    console.info("cancel");
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
    });