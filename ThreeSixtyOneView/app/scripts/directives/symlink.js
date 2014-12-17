'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('symlink', function ($timeout) {
    return {
        restrict: 'AE',
        scope: {
            target: "@"
        },
        link: function( $scope, $element, $attrs ) {
            $timeout(function(){
                var elem = $($scope.target);
                console.info("target is")
                console.info(elem.html());
                console.info(elem[0].outerHTML);
                $element[0].innerHTML = elem[0].outerHTML;
            }, 100);
        },
        replace: true
    };
});
