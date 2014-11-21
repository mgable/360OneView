'use strict';

/**
 * @ngdoc directive
 * @name threeSixtOneViewApp.directive:resize
 * @description
 * # resize
 */
angular.module('ThreeSixtyOneView.directives').directive('resize', function ($window) {
	return function (scope) {
		var w = angular.element($window);
		scope.getWindowDimensions = function () {
			return {
				'h': w[0].innerHeight,
				'w': w[0].innerWidth
			};
		};
		scope.$watch(scope.getWindowDimensions, function (newValue) {
			scope.windowHeight = newValue.h - 20;
			scope.windowWidth = newValue.w;

			scope.style = function () {
				return {
					'height': (newValue.h - 100) + 'px',
					'width': (newValue.w - 100) + 'px'
				};
			};

		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});
