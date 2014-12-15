'use strict';

//NOT USED!!!!!

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:filters
 * @description
 * # filters
 */
angular.module('ThreeSixtyOneView.directives').directive('filters', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			filters: '=',
			category: '=',
			expandall: '='
		},
		template: '<div class="pbFilterList"><member ng-repeat="member in collection.members | orderBy:\'label\'" member="member" filters="filters" category="category"  expanded="expanded" expandall="expandall"></member></div>',
		link: function(scope) {
			scope.expanded = {};
		}
	};
});


// <filters ng-if="searchResults.members" collection="searchResults" filters="addedFilter" category="{label: selectedFilter.cat.label}" expandall="filterSearch"></filters>

// <div class="pbFilterList" ng-if="searchResults.members">
// <member ng-repeat="member in searchResults.members | orderBy:\'label\'" member="member" filters="addedFilter" category="{label: selectedFilter.cat.label}"  expanded="{}" expandall="filterSearch"></member>
// </div>