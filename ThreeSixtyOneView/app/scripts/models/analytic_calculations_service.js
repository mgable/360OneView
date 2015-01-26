'use strict';

angular.module('ThreeSixtyOneView')
  	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", function (Model, AnalyticCalculationsModel) {

		var MyScenarioCalculate, myCalculate;

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(AnalyticCalculationsModel);
		angular.extend(this, myCalculate);

		this.get = function(id){
			return myCalculate.get({"id": id}, {}).then(function(response){
				return response;
			});
		};

		this.post = function(id){
			return myCalculate.post({}, {}, {id: id}).then(function(response){
				return response;
			});
		};

		this.startCalculation = function(state, id){
			if (state.currentState.name !== "FAILED"){
				return this.post(id).then(function(response){
					return response;
				});
			}
		}

	}]);
