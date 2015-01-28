/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("createButton", ["$rootScope", "CONFIG", "$state", "EVENTS", function($rootScope, CONFIG, $state, EVENTS) {
        return {
            restrict: "E",
            template: "<ms-button type='submit' action='create(CONFIG.displayActionsCreate)' label='Create' icon='plus' data-ms-id='createButton'></ms-button>",
            controller: function($scope) {
                $scope.CONFIG = CONFIG.view[$state.current.name];
                
                $scope.create = function(action, data) {
                    $rootScope.$broadcast(EVENTS[action], data);
                };
            }
        };
    }]);