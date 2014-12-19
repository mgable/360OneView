'use strict';

angular.module('ThreeSixtyOneView')
  .service('CubeService', ["Model", "CubeModel", function CubeService(Model, CubeModel) {
		var MyCubeModel, mycube;

		MyCubeModel = new Model();
		angular.extend(this, MyCubeModel.prototype);
		mycube = new MyCubeModel(CubeModel);
		angular.extend(this, mycube);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getMeta = function(cubeId){
			var additionalPath = "meta";
			return this.resource.get({id:cubeId}, this.metaConfig, additionalPath).then(function(response){
				return response;

			});
		};

		this.getMembers = function(cubeId){
			var additionalPath = "members";
			return mycube.get({id:cubeId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getViewByMembers = function(cubeId, dimensionId, hierarchyId){
			var additionalPath =  "dimension/:dimensionId/hierarchy/:hierarchyId/members";
			return mycube.get({id: cubeId, dimensionId:dimensionId, hierarchyId:hierarchyId}, additionalPath).then(function(response){
				return response;
			});
		};

}]);
