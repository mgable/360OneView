/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("msFilterDropdown", ["$document","$timeout", "CONFIG", "$state", "SortAndFilterService", function($document,$timeout,CONFIG,$state,SortAndFilterService) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "views/directives/ms_filter_dropdown.tpl.html",
            controller: function($scope, $element, $attrs) {
                var filterDropdown = $($element).find('.filterDropdown');


                function close () {
                    filterDropdown.addClass('hide');
                    $document.off('click', close);
                }

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