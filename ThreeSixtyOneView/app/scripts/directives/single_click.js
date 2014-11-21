 /*jshint -W069 */
'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('singleClick', function ($parse, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var 
          /* jshint ignore:start */
          fn = $parse(attr['singleClick']),
          /* jshint ignore:end */
          delay = 200, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = $timeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                });
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    };
  });
