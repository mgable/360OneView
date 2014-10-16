/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ModalBaseCtrl", ["$scope", "$modalInstance", "CONFIG", function($scope, $modalInstance, CONFIG){
        $scope.inputRestrictions = CONFIG.application.inputRestrictions;

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };
    }])
    .controller('ProjectRenameCtrl', ["$scope", "$controller", "$modalInstance", "data", "CONFIG", "EVENTS", function($scope, $controller, $modalInstance, data, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        $scope.data = data.item;
        $scope.name = $scope.data.title;

        $scope.rename = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            $scope.data.title = title;
            $scope.$emit(EVENTS.renameProject, $scope.data);
            $modalInstance.dismiss('create');
        };

    }]).controller('ProjectCreateCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "ProjectsModel", "GotoService", function($scope, $controller, $modalInstance, CONFIG, ProjectsModel, GotoService) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));
        var newProject = CONFIG.application.models.ProjectsModel.newProject;

        $scope.create = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            newProject.title = title;

            ProjectsModel.create(newProject).then(function(response){
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

                angular.forEach($scope.scenarioList, function(k,v,o){
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