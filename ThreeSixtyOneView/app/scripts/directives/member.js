'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:member
 * @description
 * # member
 */
angular.module('ThreeSixtyOneView').directive('member', ['$compile', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			member: '=',
			filters: '=',
			category: '=',
			searchFilter: '=',
			sortOrder: '='
		},
		template: '<div ng-class="{pbFilterListCategory: member.members.length > 0, pbFilterListValue: member.members.length === 0}"><i class="fa fa-chevron-down clickable ng-hide" ng-click="" ng-if="member.members.length > 0"></i> <label class="clickable" ng-class="{blue: checkedItems(member).checked/checkedItems(member).total === 1, bold: checkedItems(member).checked/checkedItems(member).total === 1}" ng-click="toggleItems(member)"><span ng-show="checkedItems(member).checked/checkedItems(member).total === 1"><icon type="check-circle"></icon></span><span ng-show="checkedItems(member).checked/checkedItems(member).total === 0"><icon type="circle-o"></icon></span><span ng-show="checkedItems(member).checked/checkedItems(member).total % 1 > 0"><icon type="minus-circle"></icon></span> <span>{{member.label}}</span> <span ng-if="member.members.length > 0">({{checkedItems(member).checked}}/{{checkedItems(member).total}})</span></label></div>',
		link: function(scope, element) {
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

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = scope.checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					output.total++;
					if(!!scope.filters[scope.category.label][member.label]) {
						output.checked++;
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
					scope.filters[scope.category.label][member.label] = add;
				}
			};

			scope.numCheckedItems = scope.checkedItems(scope.member);

			if(scope.member.members.length > 0) {
				$compile('<collection collection="member.members" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortOrder"></collection>')(scope, function(cloned) {
					element.after(cloned);
				});
			}
		}
	};
}]);