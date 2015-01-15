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
			expandall: '=' // <object> {label: <search text> } object containing search text
		},
		templateUrl: 'views/directives/member.tpl.html',
		link: function(scope, element) {

			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					scope.filters[scope.category.label][member.label] = add;
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
					if(!!scope.filters[scope.category.label][member.label]) {
						output.checked++;
					}
				}

				return output;
			};

			scope.expanded = scope.expanded || {};

			scope.toggleMember = function(member) {
				var item = checkedItems(member);

				if(item.checked < item.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}
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

			scope.setToggleStyle = function(member) {
				return (!!scope.expanded[member.label] || scope.expandall.label !== '') ? 'fa-rotate-90':'';
			};

			scope.isAllSelected = function(member) {
				return scope.determineStyle(member) === 'ALL_SELECTED' || ('INDETERMINENT' && member.members.length > 0);
			};

			if(scope.member.members.length > 0) {
				$compile('<div class="pbFilterCollection" ng-class="{pbFilterCollapsed: !expanded[member.label] && expandall.label === \'\'}"><member ng-repeat="child in member.members | orderBy:\'label\':false" member="child" filters="filters" category="category" expanded="expanded" expandall="expandall"></member></div>')(scope, function(cloned) {
					element.after(cloned);
				});
			}
		}
	};
}]);