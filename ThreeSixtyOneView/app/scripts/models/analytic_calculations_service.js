'use strict';

angular.module('ThreeSixtyOneView')
  	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", function (Model, AnalyticCalculationsModel, $q) {
		var MyScenarioCalculate, myCalculate, self = this,
			NOT_CALCULATED = "not_calculated",
            FAILED = "FAILED",
            SUCCESS = "SUCCESSFUL",
            IN_PROGRESS = "in_progress",
            getScenarioState = function(currentStateObj){
            	var state;
                if (currentStateObj.completed === true){
                    if (currentStateObj.name === FAILED){
                        state = FAILED;
                    } else if (currentStateObj.name === SUCCESS){
                        state = SUCCESS;
                    }
                } else if (currentStateObj.name === NOT_CALCULATED){
                    state = NOT_CALCULATED;
                } else {
                    state = IN_PROGRESS;
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
		}

	}]);
