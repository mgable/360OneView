'use strict';

angular.module('ThreeSixtyOneView')
  .service('CubeService', ["Model", "CubeModel", function CubeService(Model, CubeModel) {
		var MyCubeModel, mycube;

		MyCubeModel = new Model();
		angular.extend(this, MyCubeModel.prototype);
		mycube = new MyCubeModel(CubeModel);
		angular.extend(this, mycube);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getMeta = function(){
			var additionalPath = "meta";
			return mycube.get({}, additionalPath).then(function(response){
				var i, j, k;
				var dimensions = [];

				// dump all levels with their dimension and hierarchy id in $scoep.dimensions
				for(i = 0; i < response.dimensions.length; i++) {
					dimensions[i] = {};
					dimensions[i].label = response.dimensions[i].label;
					dimensions[i].id = response.dimensions[i].id;
					dimensions[i].levels = [];
					for(j = 0; j < response.dimensions[i].hierarchies.length; j++) {
						for(k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
							if(k === response.dimensions[i].hierarchies[j].levels.length -1) {
								if(j === response.dimensions[i].hierarchies.length - 1) {
									dimensions[i].levels.push({
										dimension: {id: response.dimensions[i].id},
										hierarchy: {id: response.dimensions[i].hierarchies[j].id},
										level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
									});
								}
							} else {
								dimensions[i].levels.push({
									dimension: {id: response.dimensions[i].id},
									hierarchy: {id: response.dimensions[i].hierarchies[j].id},
									level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
								});
							}
							
						}
					}
				}

				return dimensions;
			});
		};

		this.getMembers = function(cubeId){
			var additionalPath = "members";
			return mycube.get({id:cubeId}, {}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getViewByMembers = function(dimensionId, hierarchyId){
			var additionalPath =  "dimension/:dimensionId/hierarchy/:hierarchyId/members";
			return mycube.get({dimensionId:dimensionId, hierarchyId:hierarchyId}, additionalPath).then(function(response){
				return response;
			});
		};

}]);
