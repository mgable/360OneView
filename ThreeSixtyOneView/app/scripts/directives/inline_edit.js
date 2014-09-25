/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('inlineEdit', ["$timeout", "$rootScope", "ViewService", function($timeout, $rootScope, ViewService) {
        return {
            replace: true,
            templateUrl: function(elem, attrs){
                return "views/directives/" + attrs.template + ".tpl.html";
            },
            restrict: 'E',
            transclude: true,
            scope: {
                item: "=",
            },
            link: function($scope, $element, $attrs) {
                var tempItem = angular.copy($scope.item),
                    service = ViewService.getModel(),
                    inputTarget = $element.find(".inputTarget");

                $scope.isActive = false;

                $scope.action = function() {
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
                    service.rename($scope.item);
                    $scope.isActive = false;
                };

                $scope.cancel = function() {
                    $scope.item.title = tempItem.title;
                    $scope.item.description = tempItem.description;
                    $scope.isActive = false;
                };

                $rootScope.$on("ActiveSelection:activeItemChange", function(data){
                    if ($scope.isActive){
                        $scope.cancel();
                    }
                });
            }
        };
    }]);