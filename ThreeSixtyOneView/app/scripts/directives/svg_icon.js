'use strict';

/**
* @ngdoc directive
* @name ThreeSixtyOneView.directives:svg_icon
* @description
* # svg-icon
*/
angular.module('ThreeSixtyOneView.directives')
.directive('svgIcon', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attrs) {
            return 'images/svgs/' + attrs.type + '.svg';
        }
    };
}]);