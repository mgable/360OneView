/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ModalBaseCtrl", ["$scope", "$modalInstance", "CONFIG", function($scope, $modalInstance, CONFIG){
        $scope.inputRestrictions = CONFIG.application.inputRestrictions;

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };
    }]).controller("ScenarioCopyCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, data, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        $scope.item = data;
        $scope.item.title = "COPY -- " + $scope.item.title;
        $scope.modalProperties = {
            title: "Copy a Scenario",
            field: "Name",
            button: "Copy Scenario",
            icon: "files-o"
        };

         $scope.submit = function(title, evt){
            if (evt) { evt.preventDefault(); }
            $scope.item.title = title;
            $rootScope.$broadcast(EVENTS.copyScenario, $scope.item);
            $modalInstance.dismiss('create');
         };

    }]).controller('ProjectCreateCtrl', ["$scope", "$rootScope", "$controller", "$modalInstance", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));
        var newProject = CONFIG.application.models.ProjectsModel.newProject;

        $scope.modalProperties = {
            title: "Create a New Project",
            field: "Name",
            button: "Create New Project",
            icon: "star"
        };

        $scope.submit = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            newProject.title = title.trim(title);
            $rootScope.$broadcast(EVENTS.createProject, newProject);
            $modalInstance.dismiss('create');
        };
        
    }]).controller('CreateScenarioCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", function($scope, $rootScope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var getBaseScenario = function(){
                return angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
            }, 
            getSelected = function(){
                return selectedBaseScenario;
            },
            sortScenarios = function(scenarios){
                $scope.scenarioList = scenarios;
                $scope.masterProject = (_.findWhere($scope.scenarioList, {"title": "MASTER PROJECT"}));
                $scope.scenarioList.splice(_.indexOf($scope.scenarioList, $scope.masterProject),1);
                selectedBaseScenario = $scope.masterProject;

                angular.forEach($scope.scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        $scope.scenarioList.unshift($scope.scenarioList.splice(v,1)[0]);
                    }
                });
            },
            selectedBaseScenario;

        $scope.show = false;
        $scope.showBases = false;
        $scope.showFields = true;
        $scope.project = data.project;
        $scope.scenarios = data.scenarios;
        $scope.scenario = getBaseScenario();
        $scope.chosen = { scenario: "Choose a scenario" };

        ScenarioService.getAll().then(function(response){
            sortScenarios(response);
        });

        $scope.mainShow = function() {
            $scope.show = true;
        };
        $scope.mainHide = function() {
            $scope.show = false;
        };
        $scope.showScenario = function() {
            $scope.showBases = true;
            $scope.showFields = false;
        };
        $scope.hideScenario = function() {
            $scope.showBases = false;
            $scope.showFields = true;
        };
        $scope.setScenario= function(item){
            selectedBaseScenario = item;
        };
        $scope.showRow = function(row){
            return row === selectedBaseScenario
        };
       
        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
        };

        $scope.confirm = function(){
            $scope.scenario.referenceScenario.id = selectedBaseScenario.id;
            $scope.scenario.referenceScenario.name = selectedBaseScenario.title;
            $scope.showBases = false;
            $scope.showFields = true;
        };

        $scope.cancel = function(){
            $scope.showBases = false;
            $scope.showFields = true;
        };

        $scope.submit = function(_scenario_){
            ScenarioService.create($scope.project, _scenario_).then(function(response){
                GotoService.scenarioEdit($scope.project.id, response.id);
            });
            $scope.close();
        };

        $scope.currentScenario = function (scenario){
            DialogService.currentScenario($scope.project, scenario);
        };

}]);