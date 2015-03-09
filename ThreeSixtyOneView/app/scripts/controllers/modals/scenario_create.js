/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioCreateCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var findBaseScenario = function(scenario){
                return _.find(scenario.data, function(obj){return (/simulation/i).test(obj.type);});
            },
            getMasterProject = function(projects){
                return _.findWhere(projects, {"isMaster": true});
            },
            sortScenarios = function(scenarios){
                var scenarioList = scenarios;
                // remove master project from scenarioList
                scenarioList.splice(_.indexOf(scenarioList, $scope.masterProject),1);

                // bring current project to top of the list
                angular.forEach(scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        scenarioList.unshift(scenarioList.splice(v,1)[0]);
                    }
                });

                return scenarioList;
            },
            init = function(){
                $scope.showFields = true;
                $scope.project = data.project;
                $scope.scenarios = data.scenarios;
                $scope.scenario = angular.copy(CONFIG.application.models.ScenarioModel.newScenario);

                ScenarioService.getAll().then(function(response){
                    var baseScenario;
                    $scope.masterProject = getMasterProject(response);
                    baseScenario = findBaseScenario($scope.masterProject);
                    $scope.scenarioList = sortScenarios(response);
                    $scope.masterProjectReferenceScenario = $scope.masterProject.data[0];
                    $scope.scenario.referenceScenario.id  = baseScenario.id;
                    $scope.scenario.referenceScenario.name  = baseScenario.title;
                    selectedBaseScenario = $scope.masterProjectReferenceScenario ;
                });
            },selectedBaseScenario;

        $scope.showBaseScenario = function() {
            $scope.showFields = false;
        };

        $scope.setScenario = function(item){
            selectedBaseScenario = item;
        };

        $scope.showRow = function(row){
            return row === selectedBaseScenario;
        };

        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
        };

        $scope.confirm = function(){
            $scope.scenario.referenceScenario.id = selectedBaseScenario.id;
            $scope.scenario.referenceScenario.name = selectedBaseScenario.title;
            $scope.showFields = true;
        };

        $scope.cancel = function(){
            $scope.showFields = true;
        };

        $scope.submit = function(_scenario_){
            $scope.close();
            ScenarioService.create($scope.project, _scenario_).then(function(response){
                GotoService.scenarioEdit($scope.project.id, response.id);
            });
        };

        $scope.$on(EVENTS.updateBaseScenario, function(event, data){
            $scope.scenario.referenceScenario.id = data.id;
            $scope.scenario.referenceScenario.name = data.title;
        });

        init();
    }]);