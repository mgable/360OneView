'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:collection
 * @description
 * # collection
 */
angular.module('ThreeSixtyOneView').directive('collection', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			filters: '=',
			category: '=',
			expanded: '=',
			// searchFilter: '=',
			sortOrder: '='
		},
		template: '<div class="pbFilterCollection" ng-class="{pbFilterCollapsed: !expanded[collection.label]}"><member ng-repeat="member in collection.members | orderBy:\'label\':false" member="member" filters="filters" category="category" sortOrder="sortOrder" expanded="expanded"></member></div>'
	};
});