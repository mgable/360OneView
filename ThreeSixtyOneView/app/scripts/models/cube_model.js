'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('CubeModel', ["$location", "Resource", "CONFIG", "SERVER", function CubeModel($location, Resource, CONFIG, SERVER) {
	var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.cube.replace(/:id/, CONFIG.view.Scenario.cubeId)),
	 transformResponse = function(data){
		var dimensions = [], response = JSON.parse(data);
		if (response){
			for(var i = 0; i < response.dimensions.length; i++) {
				dimensions[i] = {};
				dimensions[i].label = response.dimensions[i].label;
				dimensions[i].id = response.dimensions[i].id;
				dimensions[i].levels = [];
				for(var j = 0; j < response.dimensions[i].hierarchies.length; j++) {
					for(var k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
						if(k === response.dimensions[i].hierarchies[j].levels.length -1) {
							if(j === response.dimensions[i].hierarchies.length - 1) {
								dimensions[i].levels.push({
									dimension: {id: response.dimensions[i].id},
									hierarchy: {id: response.dimensions[i].hierarchies[j].id},
									level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
								});
							}
						} else {
							dimensions[i].levels.push({
								dimension: {id: response.dimensions[i].id},
								hierarchy: {id: response.dimensions[i].hierarchies[j].id},
								level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
							});
						}
						
					}
				}
			}
			return dimensions;
		}
		return data;
	};


	return {
		resource: resource,
		metaConfig: {
			transformResponse: function(data){ return transformResponse(data);}
			//,transformRequest: function(data){ return JSON.stringify(data);}
		}
	};
}]);
