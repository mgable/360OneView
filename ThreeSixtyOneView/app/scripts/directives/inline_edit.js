/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('inlineEdit', ["$timeout", "$rootScope", "CONFIG", "EVENTS", function($timeout, $rootScope, CONFIG, EVENTS) {
        return {
            replace: true,
            templateUrl: function(elem, attrs){
                return "views/directives/" + attrs.template + ".tpl.html";
            },
            restrict: 'E',
            transclude: true,
            scope: {
                item: "=",
                test: "=",
                submitaction: "=",
                focustarget: "@",
                comparisonModel: "="
            },
            link: function($scope, $element, $attrs) {
                var tempItem = angular.copy($scope.item),
                    inputTarget;

                $timeout(function(){inputTarget = $element.find($scope.focustarget || "input");});
                $scope.isActive = false;
                $scope.inputRestrictions = CONFIG.application.inputRestrictions;

                // edit action
                $scope.action = function() {
                    $rootScope.$broadcast(EVENTS.newSelectedItem);
                    if (!$scope.isActive) {
                        tempItem = angular.copy($scope.item);
                        $scope.isActive = true;
                        $timeout(function(){inputTarget[0].focus();}, 100);
                    } else {
                        $scope.isActive = false;
                    }
                };


                $scope.submit = function(item) {
                    $scope.item = item;
                    $rootScope.$broadcast(EVENTS[$scope.submitaction], $scope.item);
                    $scope.form.$setPristine();
                    $scope.isActive = false;
                };

                $scope.cancel = function() {
                    if($scope.isActive){
                        $scope.item.title = tempItem.title;
                        $scope.item.description = tempItem.description;
                        $scope.form.$setPristine();
                        $scope.isActive = false;
                    }
                };

                $scope.$on(EVENTS.newSelectedItem, $scope.cancel)

            }
        };
    }]);