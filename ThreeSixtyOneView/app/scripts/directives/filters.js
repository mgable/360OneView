'use strict';

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
		template: '<div class="pbFilterList"><member ng-repeat="member in collection.members | orderBy:\'label\':sortReverse" member="member" filters="filters" category="category" sortOrder="sortReverse" expanded="expanded" expandall="expandall"></member></div>',
		link: function(scope) {
			scope.expanded = {};
		}
	};
});
