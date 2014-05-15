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
                scope.orderBy = attrs['orderby'];
                scope.reverse = false;
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
                console.info($scope);

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
            link: function postLink(scope, element, attrs) {

            },
            replace: true,
            scope: true,
            controller: function($scope, $element, $attrs, $rootScope) {
                $scope.label = $attrs.label;
                $scope.reverse = false;

                $scope.sort = function(which) {
                    if (which === $scope.orderBy) {
                        console.info("chaning reverse");
                        $scope.reverse = !$scope.reverse;
                    }
                    $scope.$parent.reverse = $scope.reverse;
                    $scope.sortBy(which);
                }
            },

            templateUrl: '/views/directives/sortingOptions.html'
        };
    });