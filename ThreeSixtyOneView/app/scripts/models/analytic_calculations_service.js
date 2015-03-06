'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", "CONFIG", function (Model, AnalyticCalculationsModel, $q, CONFIG) {
		var MyScenarioCalculate, myCalculate, self = this,
			scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
			getScenarioState = function(currentStateObj){
				var state;
				if (currentStateObj.completed === true){
					if (currentStateObj.name === scenarioStates.FAILED.message){
						state = scenarioStates.FAILED;
					} else if (currentStateObj.name === scenarioStates.SUCCESS.message){
						state = scenarioStates.SUCCESS;
					}
				} else if (currentStateObj.name === scenarioStates.NOT_CALCULATED.message){
					state = scenarioStates.NOT_CALCULATED;
				} else {
					state = scenarioStates.IN_PROGRESS;
				}
				return state;
			},
			setScenarioState = function(scenarios){
				_.each(scenarios, function(k){
					_.extend(k.currentState, getScenarioState(k.currentState));
				});
			},


		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(AnalyticCalculationsModel);
		angular.extend(this, myCalculate);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getScenarioState = getScenarioState;

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

		this.getAllScenarioStatus = function(scenarios){
			var promises = [];

			_.each(scenarios, function(k){
				promises.push(self.get(k.id));
			});

			return $q.all(promises).then(function(response){
				setScenarioState(response);
				return response;
			});
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
