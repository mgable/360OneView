'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", "CONFIG", function (Model, AnalyticCalculationsModel, $q, CONFIG) {
		var MyScenarioCalculate,
			myCalculate,
			self = this,
			scenarioStates = CONFIG.application.models.ScenarioAnalytics.states;

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(AnalyticCalculationsModel);
		angular.extend(this, myCalculate);

		this.isInProgress = function(state){
			return state === scenarioStates.IN_PROGRESS.message;
		};

		this.isFailed = function(state){
			return state === scenarioStates.FAILED.message;
		};

		this.isNotCalculated = function(state){
			return state === scenarioStates.NOT_CALCULATED.message;
		};

		this.isSuccess = function(state){
			return state === scenarioStates.SUCCESS.message;
		};

		this.get = function(id){
			return myCalculate.get({"id": id}, this.config).then(function(response){
				return response;
			});
		};

		this.post = function(id){
			return myCalculate.post({}, {}, {id: id}).then(function(response){
				return response;
			});
		};

		this.startCalculation = function(state, id){
			if (state.currentState.name !== scenarioStates.FAILED.message){
				return this.post(id).then(function(response){
					return response;
				});
			}
		};

		this.getAllStatesById = function(myScenarioArray){
			var promises = [];

			_.each(myScenarioArray, function(v){
				promises.push(self.get(v));
			});

			return $q.all(promises).then(function(response){
				return response;
			});
		};

	}]);
