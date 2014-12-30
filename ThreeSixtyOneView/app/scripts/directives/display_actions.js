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
                $scope.CONFIG = CONFIG.view[$state.current.name];
                $scope.SortAndFilterService = SortAndFilterService;
                $scope.isDisabled = $attrs.isDisabled || false;
                var filterDropdown = $($element).find('.filterDropdown');


                function close () {
                    filterDropdown.addClass('hide');
                    $document.off('click', close);
                }
                
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