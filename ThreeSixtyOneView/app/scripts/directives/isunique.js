'use strict';

angular.module('ThreeSixtyOneView.directives')
	.directive('isUnique', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		scope: {
			comparisonModel: "&isUnique"
		},
		link: function postLink(scope, element, attrs, ctrl) {
			var validate = function(viewValue) {
				if(!viewValue || !scope.comparisonModel){

					// It's valid because we have nothing to compare against
					ctrl.$setValidity('isUnique', true);
				}

				ctrl.$setValidity('isUnique', scope.comparisonModel()(viewValue) );
				return viewValue;
			};

			ctrl.$parsers.unshift(validate);
			ctrl.$formatters.push(validate);

			attrs.$observe('isUnique', function(){
				// Whenever the comparison model changes we'll re-validate
				return validate(ctrl.$viewValue);
			});

		}
	};
});

