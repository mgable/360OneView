'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ScenarioStatesService', ["$rootScope", "$interval", "AnalyticCalculationsService", "CONFIG", "EVENTS", function ($rootScope, $interval, AnalyticCalculationsService, CONFIG, EVENTS) {

        var statesArray = [],
            inprogressArray = [],
            bradcastTimer = {},
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
            setScenarioState = function(myScenario){
                _.extend(myScenario.currentState, getScenarioState(myScenario.currentState));
                return myScenario;
            },
            getAllScenariosStates = function(myScenarioArray) {
                return AnalyticCalculationsService.getAllStatesById(myScenarioArray).then(function(response) {
                    var myStatesArray = [];
                    _.each(response, function(v, i) {
                        var statesObject = {};
                        statesObject = setScenarioState(v);
                        statesObject.scenarioId = myScenarioArray[i];
                        myStatesArray.push(statesObject);
                    });
                    return myStatesArray;
                });
            },
            getAllInprogressStates = function(myStatesArray) {
                return _.filter(myStatesArray, function(v) {
                    return v.message === scenarioStates.IN_PROGRESS.message;
                });
            },
            startBroadcastScenariosStates = function(myInprogressArray) {
                console.log('broadcast scenarios: ', myInprogressArray);
                $rootScope.$broadcast('broadcastStates', myInprogressArray);
            },
            stopBroadcastScenarioStates = function() {
                $interval.cancel(bradcastTimer);
                bradcastTimer = null;
            };

        this.startPull = function(myScenarioArray) {
            statesArray = [];
            getAllScenariosStates(myScenarioArray).then(function(response) {
                statesArray = response;
                inprogressArray = getAllInprogressStates(statesArray);
                startBroadcastScenariosStates(statesArray);
                if (!_.isEmpty(inprogressArray)) {
                    stopBroadcastScenarioStates();
                    bradcastTimer = $interval(function(){
                        statesArray = [];
                        getAllScenariosStates(_.pluck(inprogressArray, 'scenarioId')).then(function(response) {
                            statesArray = response;
                            inprogressArray = getAllInprogressStates(statesArray);
                            if (_.isEmpty(inprogressArray)) {
                                startBroadcastScenariosStates(statesArray);
                                stopBroadcastScenarioStates();
                            } else {
                                startBroadcastScenariosStates(inprogressArray);
                            }
                        });
                    }, CONFIG.view.ScenarioCalculate.timerInterval);
                }
            });
        };

        $rootScope.$on('$locationChangeStart', function(event, newPath) {
            stopBroadcastScenarioStates();
        });

    }]);