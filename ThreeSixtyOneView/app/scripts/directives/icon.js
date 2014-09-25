/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("icon", [function() {
        return {
            restrict: "E",
            scope: {
                icon: "@type",
                cname: "@"
            },
            replace: true,
            template: '<i class="fa fa-{{icon}} {{cname}}"></i>'
        };
    }]);