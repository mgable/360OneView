'use strict';

angular.module('ThreeSixtyOneView.services')
.service('MetaDataService', ["$q", "Model", "MetaDataModel", function MetaDataService($q, Model, MetaDataModel) {
	var MyMetaDataModel, mymetadata, self = this;

	MyMetaDataModel = new Model();
	angular.extend(this, MyMetaDataModel.prototype);
	mymetadata = new MyMetaDataModel(MetaDataModel);
	angular.extend(this, mymetadata);

	//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

	this.getMeta = function(cubeId){
		var additionalPath = 'meta';
		return this.resource.get({id:cubeId}, this.metaConfig, additionalPath).then(function(response){
			return response;
		});
	};

	this.getLevelMembers = function(cubeId, dimensionId, hierarchyId, levelId, children) {
		var additionalPath =  'dimension/:dimensionId/hierarchy/:hierarchyId/level/:levelId/members',
			config = {
			params: {
					children: children
				}
			};

		return this.resource.get({id: cubeId, dimensionId:dimensionId, hierarchyId:hierarchyId, levelId:levelId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.buildDimensionsTree = function(cubeId) {
		return self.getMeta(cubeId).then(function(dimensions) {
			var count = 0, promises = [];

			_.each(dimensions, function(_dimension) {
				_.each(_dimension.members, function(_member) {
					promises.push(self.getLevelMembers(cubeId, _dimension.id, _member.hierarchyId, _member.levelId, true));
				});
			});

			return $q.all(promises).then(function(response) {
				_.each(dimensions, function(_dimension) {
					_.each(_dimension.members, function(_member) {
						_member.members = response[count++].members;
					});
				});

				return dimensions;
			});
		});
	};

	this.getCubeAnalysisElements = function(cubeId) {
		var additionalPath = 'analysis-element';
		return this.resource.get({id:cubeId}, {}, additionalPath).then(function(response){
			return response;
		});
	};

	this.getCubes = function(type, templateId, replaceable, globals, editable) {
		var config = {};
		config.params = {
			prediction: type,
			globals: typeof globals !== 'undefined' ? globals : false,
			editable: typeof editable !== 'undefined' ? editable : true
		};

		if(typeof templateId !== 'undefined') {
			config.params.templateId = templateId;
		}

		if(typeof replaceable !== 'undefined') {
			config.params.replaceable = replaceable;
		}

		return self.resource.get({}, config, '').then(function(cubes) {
			return cubes;
		});
	};
}]);
