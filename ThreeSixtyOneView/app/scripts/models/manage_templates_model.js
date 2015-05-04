'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ManageTemplatesModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.template),
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
