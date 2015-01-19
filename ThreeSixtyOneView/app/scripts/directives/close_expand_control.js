'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("closeExpandControl", [function() {
        return {
            restrict: "A",
            scope: {
                targetArea: "@",
                header: "@"
            },
            link: function(scope, element, attrs) {
                scope.isClosed = true;

                element.on('click', function(){
                    $(scope.targetArea).toggleClass('hidden');
                    scope.isClosed = $(scope.targetArea).hasClass('hidden');

                    if(scope.isClosed) {
                        element.removeClass("lightestgrayBg");
                    } else {
                        element.addClass("lightestgrayBg");
                    }
                });
            }
        };
    }])
    .directive("closeControl", [function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.on('click', function(){
                    $(attrs.targetArea).addClass('hidden');
                    $(attrs.header).removeClass("lightestgrayBg");
                });
            }
        };
    }]);