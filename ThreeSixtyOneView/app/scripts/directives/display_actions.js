/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("displayActions", ["$document","$timeout","$rootScope", "CONFIG", "$state", "EVENTS", "SortAndFilterService", function($document,$timeout,$rootScope, CONFIG, $state, EVENTS, SortAndFilterService) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "views/directives/display_actions.tpl.html",
            controller: function($scope, $element, $attrs) {
                // Bootstrap
                $scope.view = {};
                $scope.view.create = false;
                $scope.view.filter = false;
                $scope.view.search = false;
                $scope.CONFIG = CONFIG.view[$state.current.name];
                $scope.SortAndFilterService = SortAndFilterService;
                var filterDropdown = $($element).find('.filterDropdown');

                var show = $scope.$eval($attrs.show);

                function close () {
                    filterDropdown.addClass('hide');
                    $document.off('click', close);
                }

                function toggleActions(which) {
                    _.each(show, function(e, i, a) {
                        $scope.view[e] = true;
                    });
                }

                toggleActions(show);
                
                $scope.create = function(action, data) {
                    $rootScope.$broadcast(EVENTS[action], data);
                };

                $scope.toggle = function() {
                   if (filterDropdown.hasClass('hide')) {
                        filterDropdown.removeClass('hide');
                        $timeout(function() {
                            $document.on('click', close);
                        });
                    } else {
                        filterDropdown.addClass('hide');
                        $document.off('click', close);
                    }
                };

            }

        };
    }]);