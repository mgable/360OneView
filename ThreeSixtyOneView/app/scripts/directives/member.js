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
			member: '=',
			filters: '=',
			category: '=',
			expanded: '=',
			sortOrder: '=',
			expandall: '='
		},
		templateUrl: 'views/directives/members.tpl.html',
		link: function(scope, element) {
			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					scope.filters[scope.category.label][member.label] = add;
				}
			};

			scope.toggleMember = function(member) {
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

			scope.determineStyle = function(member){
				return scope.checkedItems(member).checked / scope.checkedItems(member).total;
			};

			scope.hasMembers = function(){
				return scope.member.members.length > 0
			}

			scope.numCheckedItems = scope.checkedItems(scope.member);

			if(scope.member.members.length > 0) {
				$compile('<div class="pbFilterCollection" ng-class="{pbFilterCollapsed: !expanded[member.label] && expandall.label === \'\'}"><member ng-repeat="child in member.members | orderBy:\'label\':false" member="child" filters="filters" category="category" sortOrder="sortOrder" expanded="expanded" expandall="expandall"></member></div>')(scope, function(cloned) {
					element.after(cloned);
				});
			}
		}
	};
}]);