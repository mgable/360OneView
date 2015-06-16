'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ManageOptimizationService', ['Model', 'ManageOptimizationModel', function (Model, ManageOptimizationModel) {
	var MyOptimizationModel, myView;

	MyOptimizationModel = new Model();
	angular.extend(this, MyOptimizationModel.prototype);
	myView = new MyOptimizationModel(ManageOptimizationModel);
	angular.extend(this, myView);

	this.create = function(scenarioId, optimizationScenario) {
		var additionalPath = 'scenario/:scenarioId';
		return this.resource.post(optimizationScenario, {}, {scenarioId: scenarioId}, additionalPath).then(function (response) {
			return response;
		});
	};
}]);