'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ['$scope', 'EVENTS', function($scope, EVENTS) {
	var init = function() {
		// do init here
	};

	$scope.$on(EVENTS.scenarioTemplatesAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);
