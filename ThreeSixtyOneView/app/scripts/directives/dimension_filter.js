'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:dimension-filter
 * @description
 * # dimension filter handler showing filter label and selected values
 * # plus a handler for opening the filters modal
 */
angular.module('ThreeSixtyOneView.directives').directive('dimensionFilter', [function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			dimension: '=',
			categorizedValues: '=',
			action: '&'
		},
		// templateUrl: 'views/directives/dimension_filter.tpl.html',
		templateUrl: function(element, attrs) {
			if(attrs.view === 'list') {
				return 'views/directives/dimension_filter_list.tpl.html';
			} else if (attrs.view === 'inline') {
				return 'views/directives/dimension_filter_inline.tpl.html';
			} else {
				return 'views/directives/dimension_filter.tpl.html';
			}
		},
		link: function(scope) {
			scope.allValuesSelected = function(values) {
				return values.selected < values.total;
			};

			// get comma separated labels for filter values
			scope.getFormattedLabels = function(labels) {
				return labels.join(', ');
			};

			scope.callAction = function(dimension) {
				scope.action({dimension: dimension});
			};
		}
	};
}]);