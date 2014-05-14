'use strict';

angular.module('filemanagerApp')
    .directive('nav', function() {
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
                    if (index !== $scope.selectedIndex) {
                        $scope.selectedIndex = index;
                    } else {
                        $scope.selectedIndex = -1;
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
    .directive('test', function() {
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
                        position: $attrs['position']
                    });
                };

                $scope.cancel = function(evt) {
                    console.info("cancel");
                    $scope.close(evt);
                }
            },
            //template: '<div><span ng-repeat="item in [1,2,3,]">{{item}}</span>hello <span ng-transclude></span></div>'
            template: '<form><div class="form-group" style="width:100%"><input type="text" class="form-control" style="width:100%;margin:0 0 5px;" ng-model="name"/></div><div class="pull-right" style="margin:0 0 5px"><button class="btn btn-primary" ng-click="submit($event)">Rename</button> <button ng-click="cancel($event)" class="btn btn-default">Cancel</button></div></form>'
        };
    });