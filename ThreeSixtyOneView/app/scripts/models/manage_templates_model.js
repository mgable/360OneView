'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ManageTemplatesModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.template);

	return {
		resource: resource,
		config: {},
		dimensions: []
	};
}]);
