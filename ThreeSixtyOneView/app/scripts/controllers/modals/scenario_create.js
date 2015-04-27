/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioCreateCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", '$filter', function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService, $filter) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var findBaseScenario = function(scenario){
                return _.find(scenario.data, function(obj){return (/simulation/i).test(obj.prediction.type);});
            },
            getMasterProject = function(projects){
                return _.findWhere(projects, {"isMaster": true});
            },
            sortScenarios = function(scenarios){
                var scenarioList = scenarios,
                // remove master project from scenarioList
                masterProject = scenarioList.splice(_.indexOf(scenarioList, $scope.masterProject),1)[0];

                // bring current project to top of the list
                angular.forEach(scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        scenarioList.unshift(scenarioList.splice(v,1)[0]);
                    }
                });

                // put the master project in first position
                scenarioList.unshift (masterProject);

                return scenarioList;
            },
            init = function(){
                $scope.showFields = true;
                $scope.project = data.project;
                $scope.scenarios = data.scenarios;
                $scope.scenario = angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
                $scope.loadingScenarios = true;

                ScenarioService.getAll().then(function(response){
                    $scope.loadingScenarios = false;
                    var baseScenario;
                    $scope.masterProject = getMasterProject(response);
                    baseScenario = findBaseScenario($scope.masterProject);
                    $scope.scenarioList = sortScenarios(response);
                    $scope.masterProjectReferenceScenario = $scope.masterProject.data[0];

                    $scope.scenario.referenceScenario.id  = baseScenario.id;
                    $scope.scenario.referenceScenario.name  = baseScenario.name;
                    $scope.scenario.referenceScenario.type  = baseScenario.type;
                    $scope.scenario.template  = baseScenario.template;
                    $scope.scenario.prediction  = baseScenario.prediction;
                    $scope.scenario.type = baseScenario.type;

                    selectedBaseScenario = $scope.masterProjectReferenceScenario;
                });
            },selectedBaseScenario;

        $scope.showBaseScenario = function() {
            $scope.showFields = false;
        };

        $scope.setScenario = function(item){
            selectedBaseScenario = item;
        };

        $scope.getScenarios = function(project, searchTerm) {
            var searchTerm = searchTerm || '',
                regExp = new RegExp(searchTerm.toLowerCase(), "g");

            if(regExp.test(project.name.toLowerCase())) {
                return project.data;
            } else {
                return $filter('filter')(project.data, {name: searchTerm});
            }
        };

        $scope.hideMasterProject = function(projectTitle, scenarioTitle, searchTerm) {
            if(!searchTerm || searchTerm.length === 0) {
                return false;
            }

            return projectTitle.toLowerCase().indexOf(searchTerm) === -1 && scenarioTitle.toLowerCase().indexOf(searchTerm) === -1;
        };

        $scope.showRow = function(row){
            return row === selectedBaseScenario;
        };

        $scope.isScenarioTitleUnique = function(scenarioName) {
            return ! _.findWhere($scope.scenarios, {name:scenarioName});
        };

        $scope.confirm = function(){
            $scope.scenario.referenceScenario.id = selectedBaseScenario.id;
            $scope.scenario.referenceScenario.name = selectedBaseScenario.name;
            $scope.showFields = true;
        };

        $scope.cancel = function(){
            $scope.showFields = true;
        };

        $scope.submit = function(scenario){
            $scope.close();
            ScenarioService.create($scope.project.uuid, scenario).then(function(response){
                GotoService.scenarioEdit($scope.project.uuid, response.id);
            });
        };

        $scope.$on(EVENTS.updateBaseScenario, function(event, data){
            $scope.scenario.referenceScenario.id = data.id;
            $scope.scenario.referenceScenario.name = data.name;
        });

        init();
    }]);