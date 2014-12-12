/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("msLink", [function() {
        return {
            restrict: "A",
            require: "^msLinkGroup",
            link: function(scope, element, attrs, ctrl) {
                var setState = function(){
                    ctrl.removeState();
                    element.addClass("selected");
                },
                init = function(){
                     ctrl.register(element);

                    if(ctrl.selectedItem === attrs.msLink){
                        setState();
                    }

                    element.on('click', {label: attrs.msLink}, ctrl.toggleSelected);
                    element.on('click', {}, setState);
                };

               init();
            }
        };
    }]);