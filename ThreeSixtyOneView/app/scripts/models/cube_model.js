'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('CubeModel', ["$location", "Resource", "CONFIG", "SERVER", function CubeModel($location, Resource, CONFIG, SERVER) {
	var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.cube.replace(/:id/, CONFIG.view.Scenario.cubeId)),
	 transformResponse = function(data){
		var dimensions = [], response = JSON.parse(data);
		if (response){

			_.each(response.dimensions, function(dimension){
				var obj = {};
				obj.label = dimension.label;
				obj.id = dimension.id;
				obj.levels = [];

				_.each(dimension.hierarchies, function(hierarchy){

					_.each(hierarchy.levels, function(level){

						obj.levels.push({
							dimension: {id: dimension.id},
							hierarchy: {id: hierarchy.id},
							level: {id: level.id,	label: level.label}
						});

					});
				});

				dimensions.push(obj);
			});

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
