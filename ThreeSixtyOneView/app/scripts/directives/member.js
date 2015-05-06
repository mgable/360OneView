'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:member
 * @description
 * # member
 */
angular.module('ThreeSixtyOneView.directives').directive('member', ['$compile', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			member: '=', // <object> {label: <dimension>, members: []} individual filter dimension i.e. touchpoint (magazine, newspaper, radio), nameplate (brand, car truck), region (New York, Miami, Seattle), time (August 2014, September 2014)
			filters: '=', // <object> {touchpoint:{}, nameplate: {}, Region: {}, Time: {}, KPI: {}} summation of all members
			category: '=', // <object> {label: <filter dimention>} currently selected filter dimension (time, touchpoint, region, nameplate)
			expanded: '=', // empty || <object> {<filter dimenstion>: true, <filter dimenstion>: true} all expanded filters
			expandall: '=', // <object> {label: <search text> } object containing search text
			updater: '&', // <function> that should be called to updated selected filters values and counts
			dimensionindex: '=' // <number> index of the selected dimension
		},
		templateUrl: 'views/directives/member.tpl.html',
		link: function(scope, element) {
			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					scope.filters[scope.category.label][member.id + ',' + member.label] = add;
				}
			},
			checkedItems = function(member) {
				var output = {checked: 0, total: 0};

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					output.total++;
					if(!!scope.filters[scope.category.label][member.id + ',' + member.label]) {
						output.checked++;
					}
				}

				return output;
			};

			scope.updaterFunction = function(index, addedFilters) {
				scope.updater({index: index, addedFilters: addedFilters});
			};

			scope.expanded = scope.expanded || {};
			scope.isAllExpanded = scope.expandall.label === '';

			scope.toggleMember = function(member) {
				var item = checkedItems(member);

				if(item.checked < item.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}

				scope.updaterFunction(scope.dimensionindex, scope.filters[scope.category.label]);
			};

			scope.determineStyle = function(member){
				var result;
				switch(checkedItems(member).checked / checkedItems(member).total){
					case 1: result = 'ALL_SELECTED'; break;
					case 0: result = 'NOT_SELECTED'; break;
					default: result = 'INDETERMINENT'; break;
				}
				return result;
			};

			scope.outputSelectedOverTotal = function(member){
				return checkedItems(member).checked.toString() + '/' + checkedItems(member).total.toString();
			};

			scope.hasMembers = function(){
				return scope.member.members.length > 0;
			};

			scope.toggleCollapse = function() {
				scope.expanded[scope.member.label] = !scope.expanded[scope.member.label];
				scope.isAllExpanded = !scope.isAllExpanded;
				return scope.expanded[scope.member.label];
			};

			scope.setToggleStyle = function() {
				return (!scope.isAllExpanded) ? 'fa-rotate-90':'';
			};

			scope.isAllSelected = function(member) {
				var selection = scope.determineStyle(member);
				return  (selection === 'ALL_SELECTED') || (selection === 'INDETERMINENT');
			};

			if(scope.member.members.length > 0) {
				$compile('<div class="list-category" ng-class="{collapsed: isAllExpanded}"><member ng-repeat="child in member.members | orderBy:\'label\':false" member="child" filters="filters" category="category" expanded="expanded" expandall="expandall" updater="updaterFunction(index, addedFilters)" dimensionindex="dimensionindex"></member></div>')(scope, function(cloned) {
					element.after(cloned);
				});
			}
		}
	};
}])
.directive('virtualRepeat', ['$compile', '$timeout', function($compile, $timeout) {
	return {
		restrict: 'AE',
		transclude: true,
		template: '<div style="position:relative;">{{list.length}}<ng-transclude></ng-transclude></div>',
		link: function(scope, element, attrs) {
			var itemHeight = 0,
				viewportHeight = 0,
				scrollTop = 0,
				scrolling = false,
				callbackDelay = 100,
				displayBuffer = 100,
				parts = attrs.virtualRepeat.match(/\b([a-z0-9]+)\b/ig),
				list = [],
				// list = scope[parts[0]][parts[1]],
				init = function() {
					var scrollerTimeout;

					// scope.virtualRepeat = list.slice(0, 1);
					scope.$watch(function() {
						if(itemHeight === 0 && element.height() > 0) {
							viewportHeight = element.parent().height();
							itemHeight = element.height();
							setHeight(itemHeight, list.length);
							scrollCallback();
						}
					});


					element.parent().scroll(function() {
						if(!scrolling) {
							scrolling = true;
							scrollerTimeout = $timeout(scrollCallback, callbackDelay);
						} else {
							$timeout.cancel(scrollerTimeout);
							scrollerTimeout = $timeout(scrollCallback, callbackDelay);
						}
					});
					scope.$watch(attrs.virtualRepeat, function(newValue) {
						list = newValue;
						if(itemHeight === 0) {
							findElementHeight();
							return;
						}
						setHeight(itemHeight, list.length, 'watch');
						scrollTop = 0;
						scrollCallback();
					});
				},
			findElementHeight = function() {
				scope.virtualRepeat = list.slice(0, 1);
			},
			setHeight = function(itemHeight, numItems) {
				element.height(itemHeight * numItems);
			},
			scrollCallback = function() {
				var newScrollTop = $('.list-box').scrollTop();
				scrolling = false;
				if((newScrollTop < scrollTop + displayBuffer*itemHeight && newScrollTop > scrollTop) && scrollTop > 0) {
					return;
				}
				scrollTop = $('.list-box').scrollTop();
				var startItem = Math.floor(scrollTop/itemHeight);
				scope.virtualRepeat = list.slice(startItem, startItem + displayBuffer);
				$compile('<div style="position:absolute;top:'+scrollTop+'px"><member ng-repeat="member in virtualRepeat" member="member" filters="addedFilter" category="{label: selectedFilter.dimension.label}"  expanded="expanded" expandall="filterSearch" updater="categorizeValuesCount(index, addedFilters)" dimensionindex="selectedDimensionIndex"></member></div>')(scope, function(cloned) {
					element.children().eq(0).replaceWith(cloned);
				});
			};

			init();
		}
	};
}]);