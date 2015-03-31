'use strict';

/**
* @ngdoc directive
* @name msTestsApp.directive:flipbook
* @description
* # flipbook
*/
angular.module('ThreeSixtyOneView.directives')
.directive('flipbook', function () {
	return {
		templateUrl: function(element, attrs) {
            return attrs.templateUrl;
        },
		restrict: 'E',
		transclude: true,
		link: function (scope, element, attrs) {
			var views = JSON.parse(attrs.data), index = 0,
			totalViews = views.length,
			basePath = attrs.basepath,
			callback = attrs.callback,
			data = views,
			type = attrs.type,
			setView = function(i){
				scope.view = views[i];
				scope.url = basePath + "/" + views[i].url;
				scope.label = views[i].buttonLabel || scope.DIRECTION;
			},
			init = function(){
				setView(index);
			};

			scope.DIRECTION = "NEXT";

			scope.data = data;
			scope.type = type;

			scope.forward = function(){
				if (index  === totalViews - 1){
					scope[callback]();
					index = totalViews;
				} else {
					setView(++index < totalViews ? index : --index);
				}
			};

			scope.backward = function(){
				setView(--index >= 0 ? index : ++index);
			};

			scope.isCurrentView = function(id){
				return id = views[index].id;
			}

			scope.isDisabled = function(direction){
				if (direction === scope.DIRECTION){
					return index >= totalViews;
				} else {
					return index <= 0;
				}
			};

			init();
		}
	};
});
