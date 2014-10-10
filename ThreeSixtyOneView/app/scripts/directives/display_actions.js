/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("displayActions", ["CONFIG", "$state", "DiaglogService", function(CONFIG, $state, DiaglogService) {
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
                scope.DiaglogService = DiaglogService;
                scope.CONFIG = CONFIG.view[$state.current.name];

                var show = scope.$eval(attrs.show);

                function toggleActions(which) {
                    _.each(show, function(e, i, a) {
                        scope.view[e] = true;
                    });
                }

                toggleActions(show);
                
                scope.create = function(action) {
                    /* jshint ignore:start */
                    eval(action);
                    /* jshint ignore:end */
                };
            }

        };
    }]);