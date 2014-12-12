/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msLinkGroup', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            scope: {
                selectedItem: "@"
            },
            controller: function($scope, $element, $attrs) {
                var self = this, items= [], init = function(){
                    self.selectedItem = $scope.selectedItem || 'none';
                    if ($attrs.radio){
                        $scope.radio = $attrs.radio === "true" ? true : false;
                    } else {
                        $scope.radio = true;
                    }
                }

                this.removeState = function(){
                    _.each(items, function(k,v,i){
                        k.removeClass("selected");
                    });
                };

                this.register = function(elem){
                    items.push(elem);
                };

                this.toggleSelected = function(event) {
                    var item = event.data.label;
                    $scope.$apply(
                        function() {
                            if (item !== $scope.selectedItem) {
                                $scope.selectedItem = item;
                            } else if (!$scope.radio) {
                                $scope.selectedItem = 'none';
                            }
                        }
                    );
                };

                init();
            }
        };
    }]);