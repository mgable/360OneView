'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('bindOnce', function ($timeout) {
    return {
        scope: true,
        link: function( $scope, $element ) {
            $timeout(function() {
                $scope.$destroy();
                $element.removeClass('ng-binding ng-scope');
                /* jshint ignore:start */
                !$element.attr('class') && $element.removeAttr('class');
                /* jshint ignore:end */
            });
        }
    };
});
