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
				var i, j, k, leafNode, newMember;
				// $scope.cube = response;
				var dimensions = [];

				// $scope.temp = [];

				// dump all levels with their dimension and hierarchy id in $scoep.dimensions
				for(i = 0; i < response.dimensions.length; i++) {
					// $scope.dimensions[i] = {};
					// $scope.dimensions[i].label = response.dimensions[i].label;
					// $scope.dimensions[i].id = response.dimensions[i].id;
					// $scope.dimensions[i].levels = [];

					leafNode = false; // new
					dimensions[i] = {
						dimensionId: response.dimensions[i].id,
						id: response.dimensions[i].id,
						label: response.dimensions[i].label,
						type: response.dimensions[i].type,
						members: []
					}; // new


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
							// if(k === response.dimensions[i].hierarchies[j].levels.length -1) {
							// 	if(j === response.dimensions[i].hierarchies.length - 1) {
							// 		$scope.dimensions[i].levels.push({
							// 			dimension: {id: response.dimensions[i].id},
							// 			hierarchy: {id: response.dimensions[i].hierarchies[j].id},
							// 			level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
							// 		});
							// 	}
							// } else {
							// 	$scope.dimensions[i].levels.push({
							// 		dimension: {id: response.dimensions[i].id},
							// 		hierarchy: {id: response.dimensions[i].hierarchies[j].id},
							// 		level: {id: response.dimensions[i].hierarchies[j].levels[k].id,	label: response.dimensions[i].hierarchies[j].levels[k].label}
							// 	});
							// }
							
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
