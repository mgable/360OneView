'use strict';

angular.module('ThreeSixtyOneView')
  	.service('ScenarioCalculateService', ["Model", "ScenarioCalculateModel", function (Model, ScenarioCalculateModel) {

		var MyScenarioCalculate, myCalculate;

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(ScenarioCalculateModel);
		angular.extend(this, myCalculate);

		this.get = function(id){
			var additionalPath = "calculate";
			return this.resource.get({"id": id}, {}, additionalPath).then(function(response){
				return response;
			});
		};

		this.post = function(id){
			var additionalPath = "calculate";
			return this.resource.post({}, {}, {id: id}, additionalPath).then(function(response){
				return response;
			});
		};

	}]);
