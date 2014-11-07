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
            },
            link: function($scope, $element, $attrs) {
                var tempItem = angular.copy($scope.item),
                inputTarget = $element.find(".inputTarget");

                $scope.isActive = false;
                $scope.inputRestrictions = CONFIG.application.inputRestrictions;

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
                    $rootScope.$broadcast(EVENTS.renameProject, $scope.item);
                    $scope.isActive = false;
                };

                $scope.cancel = function() {
                    $scope.item.title = tempItem.title;
                    $scope.item.description = tempItem.description;
                    console.log($scope.item.description);
                    $scope.isActive = false;
                };

                $rootScope.$on(EVENTS.changeActiveItem, function(data){
                    if ($scope.isActive){
                        $scope.cancel();
                    }
                });
            }
        };
    }]);