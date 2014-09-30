'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('bindOnce', function () {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
                $element.removeClass('ng-binding ng-scope');
                !$element.attr('class') && $element.removeAttr('class')
            }, 0);
        }
    }
  });
