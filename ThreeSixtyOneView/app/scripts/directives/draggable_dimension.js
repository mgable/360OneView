'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: function(elem, attrs) {
                return "views/directives/" + attrs.template + ".tpl.html";
            },
            restrict: "AE",
            replace: true,
            controller: function($scope, $element, $attrs) {
                var init = function() {
                    $scope.addDimension = $attrs.template === 'add_dimension_button' ? true : false;
                },
                added = !!$attrs.addedValues ? $attrs.addedValues : false,
                isSelected = function(label) {
                     return added ? $scope[added][label] : $scope.$parent.added[label];
                };

                var currentItem = angular.copy($scope.item);

                // determines if an item in the pop up add menu is disabled
                $scope.isItemDisabled = function(item, dimension) {
                    if(isSelected(item.label)) {
                        return true; // if item has been added, it should be disabled in the list
                    } else {
                        if(dimension.type === 'TimeDimension' && $scope.timeDisabled) {
                            if(!!currentItem && currentItem.dimension.id === dimension.id) {
                                return false; // if a time item is clicked, others should not be disabled
                            }
                            return true; // if a time item is added and a non-time item is clicked, time items should be disabled
                        }
                    }

                    return false;
                };

                $scope.selectDimension = function(selected, prioLabel) {
                    if($scope.addDimension) {
                        $scope.$parent.addItem(selected, $attrs.rowOrCol);
                    } else {
                        $scope.$parent.replaceItem(selected, prioLabel, $attrs.rowOrCol);
                    }
                };

                $scope.delete = function(index) {
                    $scope.$parent.deleteItem(index, $attrs.rowOrCol);
                };

                init();
            }
        };
    });