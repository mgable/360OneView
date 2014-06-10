'use strict';

angular.module('fileManagerApp')
    .directive('linkGroup', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.selectedItem = attrs.firstselected || 'none';
                scope.radio = attrs.radio || false;
                scope.activeSubMenu = false;

                scope.toggleSelected = function(item, subMenu) {

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

                };
            }
        };
    })
    .directive('popoverContent', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/directives/popoverTemplate.html',
            link: function(scope, element, attrs) {
                angular.extend(scope, msFilterObjByFn(attrs, function(prop) {
                    return !/^\$/.test(prop);
                }));
            },
            controller: function($scope, $element, $attrs, $timeout) {
                $scope.completed = false;

                $scope.close = function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                };

                $scope.submit = function(evt) {
                    $scope.close(evt);
                    $scope.completed = true;
                    $scope.setTitle($scope.completedtitle);

                    //TODO:  this is a very strong dependency
                    if ($scope.callback) {
                        $scope.$parent.$parent[$scope.callback]($scope.callbackData);
                    }

                    $timeout(function() {
                        $scope.$emit('$close');
                    }, 3000);
                };

                $scope.cancel = function(evt) {
                    console.info('cancel');
                    $scope.close(evt);
                    $scope.$emit('$close');
                };
            }
        };
    });