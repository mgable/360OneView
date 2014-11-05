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
            button: "Copy Scenario"
        };

         $scope.submit = function(title, evt){
            if (evt) { evt.preventDefault(); }

            $scope.item.title = title;
            console.info("I am braodcasting " + EVENTS.copyScenario);
            $rootScope.$broadcast(EVENTS.copyScenario, $scope.item);
            $modalInstance.dismiss('create');
         };

    }]).controller('ProjectCreateCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "ProjectsService", "GotoService", function($scope, $controller, $modalInstance, CONFIG, ProjectsService, GotoService) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));
        var newProject = CONFIG.application.models.ProjectsModel.newProject;

        $scope.modalProperties = {
            title: "Create a New Project",
            field: "Name",
            button: "Create New Project"
        };

        $scope.submit = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            newProject.title = title;

            ProjectsService.create(newProject).then(function(response){
                GotoService.dashboard(response.id);
            });

            $modalInstance.dismiss('create');
        };
    }]).controller('CreateScenarioCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", function($scope, $rootScope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var selectedRow,
            getSelected = function(){
                return selectedRow;
            },
            sortScenarios = function(scenarios){
                $scope.scenarioList = scenarios;
                $scope.masterProject = (_.findWhere($scope.scenarioList, {"title": "MASTER PROJECT"}));
                $scope.scenarioList.splice(_.indexOf($scope.scenarioList, $scope.masterProject),1);
                selectedRow = $scope.masterProject;

                angular.forEach($scope.scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        $scope.scenarioList.unshift($scope.scenarioList.splice(v,1)[0]);
                    }
                });
            };

        $scope.scenario = data.scenario;
        $scope.project = data.project;

        ScenarioService.getAll().then(function(response){
            sortScenarios(response);
        });

        $scope.setRow = function(item){
            //if (getStatus(id)) {
                selectedRow = item;
           // }
        };

        $scope.confirm = function(){
            $rootScope.$broadcast(EVENTS.updateBaseScenario, getSelected());
            $scope.close();
        };

        $scope.showRow = function(row){
            return row === selectedRow;
        };
}]);