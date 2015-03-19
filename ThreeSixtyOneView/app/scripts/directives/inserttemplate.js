'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:insertTemplate
 * @description
 * # insertTemplate
 */
angular.module('ThreeSixtyOneView')
  .directive('insertTemplate', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the insertTemplate directive');
      }
    };
  });
