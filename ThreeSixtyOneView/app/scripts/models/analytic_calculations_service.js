'use strict';

angular.module('ThreeSixtyOneView')
  	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", function (Model, AnalyticCalculationsModel, $q) {
		var MyScenarioCalculate, myCalculate, self = this;

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
		};

		this.getAllScenarioStatus = function(scenarios){
			var promises = [];

			_.each(scenarios, function(k,v){
				promises.push(self.get(k.id));
			});

			return $q.all(promises).then(function(response){
				console.info("all scenario status");
				console.info(response);
				return response;
			});
		}

	}]);
