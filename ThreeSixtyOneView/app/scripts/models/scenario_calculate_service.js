'use strict';

angular.module('ThreeSixtyOneView')
  	.service('ScenarioCalculateService', ["Model", "ScenarioCalculateModel", function (Model, ScenarioCalculateModel) {

		var MyScenarioCalculate, myCalculate;

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(ScenarioCalculateModel);
		angular.extend(this, myCalculate);

		this.get = function(id){
			return myCalculate.get({"id": id}, {}).then(function(response){
				return response;
			});
		};

		this.post = function(id){
			return this.resource.post({}, {}, {id: id}).then(function(response){
				return response;
			});
		};

	}]);
