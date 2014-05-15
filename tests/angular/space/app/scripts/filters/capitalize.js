'use strict';

angular.module('spaceApp')
  .filter('capitalize', function () {
    return function (input) {
      return 'capitalize filter: ' + input;
    };
  });
