'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('MetaDataModel', ["$location", "Resource", "CONFIG", "ServerService", function MetaDataModel($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.cube),
	 transformResponse = function(data) {
		var i, j, k, leafNode, newMember, dimensions = [], response = JSON.parse(data);
		
		if (response) {
			for(i = 0; i < response.dimensions.length; i++) {

				leafNode = false;
				dimensions[i] = {
					dimensionId: response.dimensions[i].id,
					id: response.dimensions[i].id,
					name: response.dimensions[i].name,
					label: response.dimensions[i].label,
					type: response.dimensions[i].type,
					members: []
				};

				for(j = 0; j < response.dimensions[i].hierarchies.length; j++) {
					for(k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
						newMember = {
							dimensionId: response.dimensions[i].id,
							hierarchyId: response.dimensions[i].hierarchies[j].id,
							hierarchyName: response.dimensions[i].hierarchies[j].name,
							hierarchyLabel: response.dimensions[i].hierarchies[j].label,
							levelId: response.dimensions[i].hierarchies[j].levels[k].id,
							id: response.dimensions[i].hierarchies[j].levels[k].id,
							name: response.dimensions[i].hierarchies[j].levels[k].name,
							label: response.dimensions[i].hierarchies[j].levels[k].label,
							leafLevel: false,
							members: []
						};
						
						// if(response.dimensions[i].hierarchies[j].levels[k].id !== response.dimensions[i].hierarchies[j].id) {
						if(k === response.dimensions[i].hierarchies[j].levels.length - 1) {
							if(!leafNode) {
								newMember.leafLevel = true;
								dimensions[i].members.push(newMember);
								leafNode = true;
							} else if(leafNode && response.dimensions[i].type === 'TimeDimension') {
								newMember.leafLevel = true;
								dimensions[i].members.push(newMember);
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
			transformResponse: function(data) { return transformResponse(data); }
			//,transformRequest: function(data){ return JSON.stringify(data);}
		}
	};
}]);
