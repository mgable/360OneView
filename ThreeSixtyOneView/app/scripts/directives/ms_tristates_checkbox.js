'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msTristatesCheckbox
 * @description
 * # ms-treeview-checkbox
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msTristatesCheckbox', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                childrenCheckboxes: '='
            },
            template: '<input type="checkbox" ng-model="parentCheckbox" ng-change="changeParentCheckbox()">',
            controller: function($scope, $element) {

                $scope.changeParentCheckbox = function() {
                    if ($scope.parentCheckbox) {
                        angular.forEach($scope.childrenCheckboxes, function(checkbox, index) {
                            if (checkbox.isLocked !== true) {
                                checkbox.isSelected = true;
                            }
                        });
                    } else {
                        angular.forEach($scope.childrenCheckboxes, function(checkbox, index) {
                            if (checkbox.isLocked !== true) {
                                checkbox.isSelected = false
                            }
                        });
                    }
                };

                $scope.$watch('childrenCheckboxes', function() {
                    var setAll = true,
                        clearAll = true;
                    angular.forEach($scope.childrenCheckboxes, function(checkbox, index) {
                        checkbox.isSelected ? clearAll = false : setAll = false;
                    });
                    if (setAll) {
                      $scope.parentCheckbox = true;
                      $element.prop('indeterminate', false);
                    }
                    else if (clearAll) {
                      $scope.parentCheckbox = false;
                      $element.prop('indeterminate', false);
                    }
                    else {
                      $scope.parentCheckbox = false;
                      $element.prop('indeterminate', true);
                    }
                }, true);

            }
        };
    });