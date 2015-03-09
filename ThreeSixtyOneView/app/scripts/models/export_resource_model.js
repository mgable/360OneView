'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ExportResourceModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.exportResource);

	return {
		resource: resource,
		config: {}
	};
}]);