/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("MainCtrl", ["$scope", "$location", "ErrorService", "CONFIG", "ServerService", "$state",
	function($scope, $location, ErrorService, CONFIG, ServerService, $state) {
		var init = function() {
		};
		// Error service surfaced here
		// For unit testing only;
		$scope.ErrorService = ErrorService;
		$scope.CONFIG = CONFIG;

		// querystring 'e2e' formats data for protractor tests
		if ($location.search().e2e === "true"){
			$scope.e2e = true;
		}

		console.info(ServerService.get($location.host()));

		// convenience methods
		$scope.console = function console(msg) {
			console.info(msg);
		};

		$scope.alert = function alert(msg, evt) {
			window.alert(msg);
			if (evt){
				evt.stopPropagation();
			}
		};

		init();
	}]);