/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("createButton", ["$rootScope", "CONFIG", "$state", "EVENTS", function($rootScope, CONFIG, $state, EVENTS) {
        return {
            restrict: "E",
            replace: true,
            template: "<button class='btn btn-default' ng-click='create(CONFIG.displayActionsCreate)' data-ms-id='createButton'><icon type='plus'></icon>CREATE</button>",
            controller: function($scope) {
                $scope.CONFIG = CONFIG.view[$state.current.name];
                //$scope.isDisabled = $attrs.isDisabled || false;
                
                $scope.create = function(action, data) {
                    console.log($scope);
                    $rootScope.$broadcast(EVENTS[action], data);
                };
            }
        };
    }]);