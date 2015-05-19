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

					scope.$watch(attrs.virtualRepeat, function(newValue) {
						if(multiLevel) {
							scope.virtualRepeat = newValue;
						} else {
							list = newValue;
							$('.list-box').scrollTop(0);

							if(list[0].members.length > 0) {
								scope.multiLevelList(true);
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
									setHeight(itemHeight, list.length, 'watch');
									updateDOM();
								}
							}
						}
					});
				},
			findElementHeight = function() {
				scope.virtualRepeat = list.slice(0, 1);
			},
			setHeight = function(itemHeight, numItems) {
				element.height(itemHeight * numItems);
			},
			updateDOM = function() {
				var newScrollTop = $('.list-box').scrollTop();
				scrolling = false;
				// if((newScrollTop < scrollTop + displayBuffer*itemHeight && newScrollTop > scrollTop) && scrollTop > 0) {
				// 	return;
				// }
				scrollTop = $('.list-box').scrollTop();
				var startItem = Math.floor(scrollTop/itemHeight);
				scope.virtualRepeat = list.slice(startItem, startItem + displayBuffer);
				$compile('<div style="position:absolute;top:'+scrollTop+'px"><member ng-repeat="member in virtualRepeat" member="member" filters="addedFilter" category="{label: selectedFilter.dimension.label}"  expanded="expanded" expandall="filterSearch" updater="categorizeValuesCount(index, addedFilters)" dimensionindex="selectedDimensionIndex"></member></div>')(scope, function(cloned) {
					element.children().eq(0).replaceWith(cloned);
				});
			},
			setScrollEvent = function() {
				var scrollerTimeout;

				element.parent().scroll(function() {
					if(!scrolling) {
						scrolling = true;
						scrollerTimeout = $timeout(updateDOM, callbackDelay);
					} else {
						$timeout.cancel(scrollerTimeout);
						scrollerTimeout = $timeout(updateDOM, callbackDelay);
					}
				});
			};

			init();
		}
	};
}]);