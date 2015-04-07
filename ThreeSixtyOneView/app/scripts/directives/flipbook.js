'use strict';

/**
* @ngdoc directive
* @name msTestsApp.directive:flipbook
* @description
* # flipbook
*/
angular.module('ThreeSixtyOneView.directives')
.directive('flipbook', ['EVENTS', '$window', function (EVENTS, $window) {
	return {
		templateUrl: function(element, attrs) {
			return attrs.templateUrl;
		},
		restrict: 'E',
		transclude: true,
		link: function (scope, element, attrs) {
			var views = JSON.parse(attrs.workflow),
				totalViews = views.length,
				basePath = attrs.basepath,
				submitCallback = attrs.submitCallback,
				cancelCallback = attrs.cancelCallback,
				setView = function(i) {
					scope.view = views[i];
					scope.url = basePath + "/" + views[i].url;
					scope.label = views[i].buttonLabel || scope.DIRECTION;
				}, init = function() {
					scope.DIRECTION = "NEXT";
					scope.views = views;
					scope.currentViewIndex = 0;

					setView(scope.currentViewIndex);
				};


			scope.forward = function(){
				if (scope.currentViewIndex  === totalViews - 1) {
					scope[submitCallback]();
					scope.currentViewIndex = totalViews;
				} else {
					setView(++scope.currentViewIndex < totalViews ? scope.currentViewIndex : --scope.currentViewIndex);
					scope.$broadcast(EVENTS.moveForward ,{});
				}
			};

			scope.backward = function() {
				setView(--scope.currentViewIndex >= 0 ? scope.currentViewIndex : ++scope.currentViewIndex);
			};

			scope.dismiss = function() {
				scope[cancelCallback]();
			};

			scope.isCurrentView = function(index) {
				return index === scope.currentViewIndex;
			};

			scope.isDisabled = function(direction) {
				if (direction === scope.DIRECTION) {
					return scope.currentViewIndex >= totalViews;
				} else {
					return scope.currentViewIndex <= 0;
				}
			};

			init();
		}
	};
}]);
