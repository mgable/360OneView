'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ModelScenarioTemplatesModelCtrl
 * @description
 * # ModelScenarioTemplatesModelCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView.services')
.factory('ScenarioTemplatesModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.pivotdata);

	return {
		resource: resource,
		config: {}
	};
}]);
