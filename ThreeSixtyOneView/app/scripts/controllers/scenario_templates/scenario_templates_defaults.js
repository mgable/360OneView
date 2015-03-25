'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesCtrl
 * @description
 * # ScenarioTemplatesCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesDefaultsCtrl', ['$scope', '$filter', 'datepickerConfig', function ($scope, $filter, datepickerConfig) {

	var init = function() {
		$scope.dateFormat = 'yyyy-MM-dd';
		$scope.fromDate = new Date();
		$scope.toDate = new Date();

		// datepicker options
		datepickerConfig.minDate = '2014-01-02';
		datepickerConfig.maxDate = '2016-01-01';
		datepickerConfig.startingDay = 1;
	};

	$scope.getFormattedDate = function(date) {
		return $filter('date')(date.getTime(),'yyyy-MM-dd');
	};

	init();
}]);
