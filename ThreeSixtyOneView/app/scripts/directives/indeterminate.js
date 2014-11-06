'use strict';

/**
 * @ngdoc directive
 * @name threeSixtOneViewApp.directive:indeterminate
 * @description
 * # indeterminate
 */
angular.module('ThreeSixtyOneView').directive('indeterminate', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch(attrs.indeterminate, function (value) {
				if(value === 1) {
					element.prop('indeterminate', false);
					element.prop('checked', true);
				} else if(value === 0) {
					element.prop('indeterminate', false);
					element.prop('checked', false);
				} else {
					element.prop('indeterminate', true);
				}
			});
		}
	};
});
