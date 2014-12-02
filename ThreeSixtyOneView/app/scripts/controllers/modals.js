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
        
    }]).controller('XXXXXCreateScenarioCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", function($scope, $rootScope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS) {

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

        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
        };

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
}]).controller('CreateScenarioCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", function($scope, $rootScope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var getBaseScenario = function(){
                return angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
            },
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
            },
            selectedRow;

        $scope.show = false;
        $scope.showBases = false;
        $scope.showFields = true;
        $scope.GotoService = GotoService;
        $scope.project = data.project;
        $scope.scenarios = data.scenaios;
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
        $scope.setRow = function(item){
            selectedRow = item;
        };
        $scope.showRow = function(row){
            return row === selectedRow;
        };
       
        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            console.info("scenario title was");
            console.info(scenarioTitle);
            console.info($scope.scenarios);
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
        };

        $scope.confirm = function(){
            $rootScope.$broadcast(EVENTS.updateBaseScenario, getSelected());
            $scope.showBases = false;
            $scope.showFields = true;
            //$scope.close();
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

        $scope.$on(EVENTS.updateBaseScenario, function(event, data){
            $scope.scenario.referenceScenario.id = data.id;
            $scope.scenario.referenceScenario.name = data.title;
        });
}]).controller('FilterSelectionCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", function($scope, $rootScope, $modalInstance, $controller, data, ScenarioService, CONFIG) {
    angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

    var init = function() {
        $scope.data = data;
        console.log($scope.data);
    };

    init();
}]);