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
      templateUrl: "views/directives/flipbook.tpl.html" ,
      restrict: 'E',
      transclude: true,
      link: function (scope, element, attrs) {
        var views = JSON.parse(attrs.data || '[{"buttonLabel":"foo"}]'), index = 0,
        	totalViews = views.length,
        	basePath = attrs.basepath,
        	callback = attrs.callback,
	        setView = function(i){
	        	scope.view = basePath + "/" + views[i].url;
	        	scope.label = views[i].buttonLabel || scope.DIRECTION;
	        },
	        init = function(){
	        	setView(index);
	        }

	    scope.DIRECTION = "forward";
        
        scope.forward = function(){
        	if (index  === totalViews - 1){
        		scope[callback]();
        		index = totalViews;
        	} else {
        		setView(++index < totalViews ? index : --index);
        	}
        }

        scope.backward = function(){
        	setView(--index >= 0 ? index : ++index);
        }

        scope.isDisabled = function(direction){
        	console.info(index, totalViews);
        	if (direction === scope.DIRECTION){
        		return index >= totalViews;
        	} else {
        		return index <= 0;
        	}
        }

        init();
      }
    };
  });
