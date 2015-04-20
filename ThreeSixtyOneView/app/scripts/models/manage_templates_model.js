'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ManageTemplatesModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.template),
		self = this,
		formDimensions = function(_dimensions) {
			var dimensions = [];
			_.each(_dimensions, function(_dimension) {
				dimensions.push({
					id: _dimension.id,
					dimensionId: _dimension.id,
					name: _dimension.name,
					label: _dimension.label,
					type: _dimension.type,
					aggregatable: typeof _dimension.aggregatable !== 'undefined' ? _dimension.aggregatable : null,
					members: []
				});
			});

			return dimensions;

			var i, j, k, leafNode, newMember, dimensions = [], response = JSON.parse(data);
			
					for(j = 0; j < response.dimensions[i].hierarchies.length; j++) {
						for(k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
							
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

		},
		formHierarchies = function(dimensions, dimensionIndex, hierarchy) {
			_.each(hierarchy.levels, function(level) {
				dimensions[dimensionIndex].members.push({
					dimensionId: dimensions[dimensionIndex].id,
					hierarchyId: hierarchy.id,
					hierarchyName: hierarchy.name,
					hierarchyLabel: hierarchy.label,
					levelId: level.id,
					id: level.id,
					name: level.name,
					label: level.label,
					leafLevel: false,
					members: []
				});
			});

			return dimensions;
		};

	return {
		resource: resource,
		config: {},
		dimensions: [],
		kpis: [],
		formDimensions: formDimensions,
		formHierarchies: formHierarchies
	};
}]);
