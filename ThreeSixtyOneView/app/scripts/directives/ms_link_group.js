/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msLinkGroup', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                $timeout(function() {
                    $scope.selectedItem = $attrs.firstselected || 'none';
                });

                $scope.radio = $attrs.radio || false;
                $scope.enabled = true;

                this.toggleSelected = function(event) {
                    var item = event.data.label;
                    $scope.$apply(
                        function() {
                            if ($scope.enabled) {
                                if (item !== $scope.selectedItem) {
                                    $scope.selectedItem = item;
                                } else if (!$scope.radio) {
                                    $scope.selectedItem = 'none';
                                }
                            }
                        }
                    );
                };
            }
        };
    }]).directive("msLink", [function() {
        return {
            restrict: "A",
            require: "^msLinkGroup",
            link: function(scope, element, attrs, ctrl) {
                element.on('click', {
                    label: attrs.msLink
                }, ctrl.toggleSelected);
            }
        };
    }]);