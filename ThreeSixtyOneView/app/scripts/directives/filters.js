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
		template: '<div class="pbFilterList"><member ng-repeat="member in collection.members | orderBy:\'label\':sortReverse" member="member" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortReverse"></member></div>',
		link: function(scope) {
			scope.toggleItems = function(member) {
				var checkedItems = scope.checkedItems(member);

				if(checkedItems.checked < checkedItems.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}
			};

			scope.checkedItems = function(member) {
				var output = {checked: 0, total: 0};

				if(!member) {
					return output;
				}

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = scope.checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					var searchText = scope.searchFilter.label ? scope.searchFilter.label : '';
					if(angular.lowercase(member.label).indexOf(searchText) > -1) {
						output.total++;
						if(!!scope.filters[scope.category.label][member.label]) {
							output.checked++;
						}
					}
				}

				return output;
			};

			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					var searchText = scope.searchFilter.label ? scope.searchFilter.label : '';
					if(angular.lowercase(member.label).indexOf(searchText) > -1) {
						scope.filters[scope.category.label][member.label] = add;
					}
				}
			};

			scope.searchFilter = {label: ''};
		}
	};
});
