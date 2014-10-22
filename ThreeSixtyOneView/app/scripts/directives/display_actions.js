/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("displayActions", ["$rootScope", "CONFIG", "$state", "EVENTS", "SortAndFilterService", function($rootScope, CONFIG, $state, EVENTS, SortAndFilterService) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "views/directives/display_actions.tpl.html",
            link: function(scope, element, attrs) {
                // Bootstrap
                scope.view = {};
                scope.view.create = false;
                scope.view.filter = false;
                scope.view.search = false;
                scope.CONFIG = CONFIG.view[$state.current.name];
                scope.SortAndFilterService = SortAndFilterService;

                var show = scope.$eval(attrs.show);

                function toggleActions(which) {
                    _.each(show, function(e, i, a) {
                        scope.view[e] = true;
                    });
                }

                toggleActions(show);
                
                scope.create = function(action, data) {
                    //action is and EVENTS.type
                    /* jshint ignore:start */
                    //eval(action);
                    /* jshint ignore:end */
                    $rootScope.$broadcast(EVENTS[action], data);
                };
            }

        };
    }]);