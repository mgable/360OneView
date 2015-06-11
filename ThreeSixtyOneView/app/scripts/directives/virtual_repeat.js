'use strict';

angular.module('ThreeSixtyOneView.directives')
.directive('virtualRepeat', ['$compile', '$timeout', function($compile, $timeout) {
	return {
		restrict: 'AE',
		transclude: true,
		template: '<div style="position:relative;"><ng-transclude></ng-transclude></div>',
		link: function(scope, element, attrs) {
			var itemHeight = 0,
				viewportHeight = 0,
				scrollTop = 0,
				scrolling = false,
				callbackDelay = 75,
				displayBuffer = 50,
				list = [],
				multiLevel = false,
				heightWatch = angular.noop,
				init = function() {

					heightWatch = scope.$watch(function() {
						if(itemHeight === 0 && element.height() > 0) {
							viewportHeight = element.parent().height();
							itemHeight = element.height();
							setHeight(itemHeight, list.length);
							updateDOM();
						}
					});

					// watch the list for any changes
					scope.$watch(attrs.virtualRepeat, function(newValue) {
						if(multiLevel) {
							scope.virtualRepeat = newValue;
						} else {
							list = newValue;
							element.parent().scrollTop(0);

							if(list[0].members.length > 0) {
								scope[attrs.multiLevel](true);
								multiLevel = true;
								element.parent().off('scroll');
								element.height(0);
								heightWatch();
								scope.virtualRepeat = list;
							} else {
								if(itemHeight === 0) {
									findElementHeight();
									setScrollEvent();
								} else {
									scrollTop = 0;
									setHeight(itemHeight, list.length);
									updateDOM();
								}
							}
						}
					});
				},
			// find height of a single item
			findElementHeight = function() {
				scope.virtualRepeat = list.slice(0, 1);
			},
			// set height of the element based on single element height and number of items
			setHeight = function(itemHeight, numItems) {
				element.height(itemHeight * numItems);
			},
			// update the DOM (after scroll or list change)
			updateDOM = function() {
				scrolling = false;
				scrollTop = element.parent().scrollTop();
				var startItem = Math.floor(scrollTop/itemHeight);
				scope.virtualRepeat = list.slice(startItem, startItem + displayBuffer);
				$compile('<div style="position:absolute;top:'+scrollTop+'px"><member ng-repeat="member in virtualRepeat" member="member" filters="addedFilter" category="{label: selectedFilter.dimension.label}"  expanded="expanded" expandall="filterSearch" updater="categorizeValuesCount(index, addedFilters)" dimensionindex="selectedDimensionIndex"></member></div>')(scope, function(cloned) {
					element.children().eq(0).replaceWith(cloned);
				});
			},
			// set up the scroll event listener
			setScrollEvent = function() {
				var scrollerTimeout;

				element.parent().scroll(function() {
					if(!scrolling) {
						scrolling = true;
					} else {
						$timeout.cancel(scrollerTimeout);
					}
					scrollerTimeout = $timeout(updateDOM, callbackDelay);
				});
			};

			init();
		}
	};
}]);