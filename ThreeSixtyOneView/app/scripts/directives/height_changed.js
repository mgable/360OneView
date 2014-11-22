/* global $:false */

'use strict';

angular.module('ThreeSixtyOneView')
    .directive('elemHeightChanged', ["$rootScope", "EVENTS",
        function($rootScope, EVENTS) {
            return {
                restrict: 'AE',
                link: function(scope, element, attributes) {
                    scope.$watch(
                        function() {
                            scope.elemHeight = element[0].clientHeight;
                            return scope.elemHeight;
                        },
                        function(newValue, oldValue) {
                            if (newValue != oldValue) {
                                console.log('newValue: ', newValue, 'oldValue: ', oldValue);
                                $rootScope.$broadcast(EVENTS.heightChanged, newValue);
                            }
                        }
                    );
                }

            };
        }
    ]);
