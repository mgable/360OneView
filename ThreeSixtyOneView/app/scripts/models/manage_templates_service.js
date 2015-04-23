'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ManageTemplatesService', ['$q', 'Model', 'ManageTemplatesModel', function ($q, Model, ManageTemplatesModel) {
	var MyManageTemplatesModel, mymanagetemplatesdata, self = this,
		resetView = function(newView) {
			newView.id = null;
			_.each(newView.filters, function(filter) {
				filter.id = null;
			});
			return newView;
		};

	MyManageTemplatesModel = new Model();
	angular.extend(this, MyManageTemplatesModel.prototype);
	mymanagetemplatesdata = new MyManageTemplatesModel(ManageTemplatesModel);
	angular.extend(this, mymanagetemplatesdata);

	this.getAll = function(type) {
		var config = {
			params: {}
		};
		if(!!type) {
			config.params.type = type;
		}

		return this.resource.get({}, config, '').then(function(response) {
			return response;
		});
	};

	this.get = function(templateId, extended) {
		var config = {
			params: {
				extended: true
			}
		};
		if(typeof extended !== 'undefined') {
			config.params.extended = extended;
		}

		return this.resource.get({templateId: templateId}, config, '').then(function(response) {
			if(response.dimensions) {
				self.dimensions = self.formDimensions(response.dimensions);
			}
			if(response.kpis) {
				self.kpis = response.kpis;
			}
			return response;
		});
	};

	this.create = function(template) {
		return this.resource.post(template, {}, {}, '').then(function(response) {
			return response;
		});
	};

	this.update = function(template, commit) {
		var config = {
			params: {}
		};
		if(commit === true) {
			config.params.commit = true;
		}
		
		return this.resource.put(template, config, {templateId: template.id}, '').then(function(response) {
			return response;
		});
	};

	this.delete = function(templateId) {
		return this.resource.delete('', {}, {templateId: templateId}, '').then(function(response) {
			self.dimensions = [];
			self.kpis = [];
			return response;
		});
	};

	this.getHierarchy = function(templateId, dimensionId) {
		var additionalPath = 'dimension/:dimensionId/hierarchy';
		return this.resource.get({templateId: templateId, dimensionId: dimensionId}, {}, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getMembers = function(templateId, dimensionId, hierarchyId, levelId) {
		var additionalPath = 'dimension/:dimensionId/hierarchy/:hierarchyId/level/:levelId/members',
			config = {
				params: {
					children: true
				}
			};
		return this.resource.get({templateId: templateId, dimensionId: dimensionId, hierarchyId: hierarchyId, levelId: levelId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getDimensions = function() {
		return self.dimensions;
	};

	this.getKpis = function() {
		return self.kpis;
	};

	this.buildHierarchies = function(templateId) {
		var promises = [];

		_.each(self.dimensions, function(dimension) {
			promises.push(self.getHierarchy(templateId, dimension.id));
		});

		return $q.all(promises).then(function(responses) {
			_.each(responses, function(response, index) {
				_.each(response, function(hierarchy) {
					self.formHierarchies(self.dimensions, index, hierarchy);
				});
			});

			return self.dimensions;
		});
	};

	this.buildDimensionsTree = function(templateId) {
		var promises = [],
			count = 0;

		return self.buildHierarchies(templateId).then(function(dimensions) {
			_.each(self.dimensions, function(dimension) {
				_.each(dimension.members, function(level) {
					promises.push(self.getMembers(templateId, level.dimensionId, level.hierarchyId, level.id));
				});
			});

			return $q.all(promises).then(function(responses) {
				_.each(self.dimensions, function(dimension) {
					_.each(dimension.members, function(level) {
						level.members = responses[count++].members
					});
				});
				return self.dimensions;
			});
		});
	};

	this.createView = function(templateId, newView) {
		var additionalPath = 'views';
		newView.isDefault = true;

		return this.resource.post(resetView(newView), {}, {templateId: templateId}, additionalPath).then(function (response) {
			return response;
		});
	};

	this.getTemplateCubeByName = function(templateId, cubeName) {
		var additionalPath = 'cube/id',
			config = {
				params: {
					cubeName: cubeName
				}
			};
		return this.resource.get({templateId: templateId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getTemplateCubesByType = function(templateId, cubeType) {
		// cubeType could be: Standard, Spend, Outcome
		var additionalPath = 'cube/ids',
			config = {
				params: {
					type: cubeType
				}
			};
		return this.resource.get({templateId: templateId}, config, additionalPath).then(function(response) {
			return response;
		});
	};
}]);
