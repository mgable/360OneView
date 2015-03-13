'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:ModelScenarioTemplatesServiceCtrl
* @description
* # ModelScenarioTemplatesServiceCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView.services')
.service('ScenarioTemplatesService', ['Model', 'ScenarioTemplatesModel', function (Model, ScenarioTemplatesModel) {
	var MyScenarioTemplatesModel, myscenariotemplatesdata;

	MyScenarioTemplatesModel = new Model();
	angular.extend(this, MyScenarioTemplatesModel.prototype);
	myscenariotemplatesdata = new MyScenarioTemplatesModel(ScenarioTemplatesModel);
	angular.extend(this, myscenariotemplatesdata);
}]);
