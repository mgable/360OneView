'use strict';

angular.module('ThreeSixtyOneView.services')
  	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", "CONFIG", function (Model, AnalyticCalculationsModel, $q, CONFIG) {
		var MyScenarioCalculate, myCalculate, self = this,
			scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
            getScenarioState = function(currentStateObj){
            	console.info("the current object is");
            	console.info(currentStateObj);
            	var state;
                if (currentStateObj.completed === true){
                    if (currentStateObj.name === scenarioStates.FAILED.message){
                        state = scenarioStates.FAILED.message;
                    } else if (currentStateObj.name === scenarioStates.SUCCESS.message){
                        state = scenarioStates.SUCCESS.message;
                    }
                } else if (currentStateObj.name === scenarioStates.NOT_CALCULATED.message){
                    state = scenarioStates.NOT_CALCULATED.message;
                } else {
                    state = scenarioStates.IN_PROGRESS.message;
                }
                return state;
            },
            setScenarioState = function(scenarios){
            	_.each(scenarios, function(k){
            		k.currentState.state = getScenarioState(k.currentState);
            	});
            }

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(AnalyticCalculationsModel);
		angular.extend(this, myCalculate);

		this.getScenarioState = getScenarioState;

		this.isInProgress = function(state){
			return state === scenarioStates.IN_PROGRESS.message;
		};

		this.isFailed = function(state){
			return state === scenarioStates.FAILED.message;
		};

		this.isNotCalculated = function(state){
			return state = scenarioStates.NOT_CALCULATED.message;
		};

		this.isSuccess = function(state){
			return state = scenarioStates.SUCCESS.message;
		};

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
				setScenarioState(response);
				return response;
			});
		};

	}]);
