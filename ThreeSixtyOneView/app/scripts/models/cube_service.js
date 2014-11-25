'use strict';

angular.module('ThreeSixtyOneView')
  .service('CubeService', ["Model", "CubeModel", function CubeService(Model, CubeModel) {
		var MyCubeModel, mycube;

		MyCubeModel = new Model();
		angular.extend(this, MyCubeModel.prototype);
		mycube = new MyCubeModel(CubeModel);
		angular.extend(this, mycube);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getMeta = function(id){
			var additionalPath = "meta";
			return mycube.get({id:id}, {}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getMembers = function(id){
			var additionalPath = "members";
			return mycube.get({id:id}, {}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getViewByMembers = function(id, dimensionId, hierarchyId){
			var additionalPath =  "dimension/:dimensionId/hierarchy/:hierarchyId/members";
			return mycube.get({id:id, dimensionId:dimensionId, hierarchyId:hierarchyId}, {}, additionalPath).then(function(response){
				return response;
			});
		};

}]);
