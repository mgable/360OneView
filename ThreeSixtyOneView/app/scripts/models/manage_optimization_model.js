'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ManageOptimizationModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.optimization);

	return {
		resource: resource,
		config: {}
	};
}]);