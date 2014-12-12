'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: 'views/directives/draggable_dimension.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                name: '=',
                close: '&clickClose',
                menu: '='
            },
            link: function(scope, elem, attrs) {
                console.info(scope.menu);
                elem.on('click', '.fa-remove', function() {
                    $(this).parents('.pbItem').remove();
                    scope.close();
                });

                elem.on('click', '.pbItemInfo', function(){
                    $(this).parents('.pbItem').find('.pbAddPopUp').toggle();
                });
            }
        };
    });