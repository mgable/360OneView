'use strict';

angular.module('ThreeSixtyOneView')
  .service('MetaDataService', ["$q", "Model", "MetaDataModel", function MetaDataService($q, Model, MetaDataModel) {
		var MyMetaDataModel, mymetadata, self = this;

		MyMetaDataModel = new Model();
		angular.extend(this, MyMetaDataModel.prototype);
		mymetadata = new MyMetaDataModel(MetaDataModel);
		angular.extend(this, mymetadata);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getMeta = function(cubeId){
			var additionalPath = "meta";
			return this.resource.get({id:cubeId}, this.metaConfig, additionalPath).then(function(response){
				return response;
			});
		};

		this.getMembers = function(cubeId){
			var additionalPath = "members";
			return mymetadata.get({id:cubeId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getViewByMembers = function(cubeId, dimensionId, hierarchyId){
			var additionalPath =  "dimension/:dimensionId/hierarchy/:hierarchyId/members";
			return mymetadata.get({id: cubeId, dimensionId:dimensionId, hierarchyId:hierarchyId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getLevelMembers = function(cubeId, dimensionId, hierarchyId, levelId, children) {
			var additionalPath =  "dimension/:dimensionId/hierarchy/:hierarchyId/level/:levelId/members?children=" + children;

			return mymetadata.get({id: cubeId, dimensionId:dimensionId, hierarchyId:hierarchyId, levelId:levelId}, additionalPath).then(function(response) {
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
			var additionalPath = "analysis-element";
			return mymetadata.get({id:cubeId}, additionalPath).then(function(response){
				return response;
			});
		};
}]);
