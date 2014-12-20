'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('CubeModel', ["$location", "Resource", "CONFIG", "SERVER", function CubeModel($location, Resource, CONFIG, SERVER) {
	var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.cube),
	 transformResponse = function(data){
		var i, j, k, leafNode, newMember, dimensions = [], response = JSON.parse(data);
		if (response){
			for(i = 0; i < response.dimensions.length; i++) {

				leafNode = false;
				dimensions[i] = {
					dimensionId: response.dimensions[i].id,
					id: response.dimensions[i].id,
					label: response.dimensions[i].label,
					type: response.dimensions[i].type,
					members: []
				};


				for(j = 0; j < response.dimensions[i].hierarchies.length; j++) {
					for(k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
						newMember = {
							dimensionId: response.dimensions[i].id,
							hierarchyId: response.dimensions[i].hierarchies[j].id,
							levelId: response.dimensions[i].hierarchies[j].levels[k].id,
							id: response.dimensions[i].hierarchies[j].levels[k].id,
							label: response.dimensions[i].hierarchies[j].levels[k].label,
							members: []
						};
						
						if(response.dimensions[i].hierarchies[j].levels[k].id !== response.dimensions[i].hierarchies[j].id && response.dimensions[i].type !== 'TimeDimension') {
							if(!leafNode) {
								dimensions[i].members.push(newMember);
								leafNode = true;
							}
						} else {
							if(!leafNode) {
								dimensions[i].members.push(newMember);
							} else {
								dimensions[i].members.splice(dimensions[i].members.length - 1, 0, newMember);
							}
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
