'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:filters
 * @description
 * # filters
 */
angular.module('ThreeSixtyOneView').directive('filters', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			filters: '=',
			category: '='
		},
		template: '<div class="pbFilterList"><member ng-repeat="member in collection.members | orderBy:\'label\':sortReverse" member="member" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortReverse" expanded="expanded"></member></div>',
		link: function(scope) {
			scope.expanded = {};
			scope.searchFilter = {label: ''};
		}
	};
});
