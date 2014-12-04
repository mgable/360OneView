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
			searchFilter: '=',
			sortOrder: '='
		},
		template: '<div class="pbFilterCollection"><member ng-repeat="member in collection | orderBy:\'label\':false" member="member" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortOrder"></member></div>'
	};
});