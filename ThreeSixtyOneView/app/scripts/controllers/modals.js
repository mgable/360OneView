'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ProjectRenameCtrl', ["$scope", "$modalInstance", "data", function($scope, $modalInstance, data) {
        var service = data.service;
        $scope.data = data.item;
        $scope.name = $scope.data.title;

        $scope.rename = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            $scope.data.title = title;
            service.rename($scope.data);
            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel");
            $modalInstance.dismiss('canceled');
        };
    }]).controller('ProjectCreateCtrl', ["$scope", "$rootScope", "$modalInstance", "ProjectsModel", "CONFIG", function($scope, $rootScope, $modalInstance, ProjectsModel, CONFIG) {
        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };

        $scope.create = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            var newProject = CONFIG.application.models.ProjectsModel.newProject;
            newProject.title = title;
            // create the new project
            //TODO: refactor this to an event
            ProjectsModel.create(newProject);
            $modalInstance.dismiss('create');
        };
    }]).controller('CreateScenarioCtrl', ["$scope", "$modalInstance", "data", function($scope, $modalInstance, data) {
        $scope.scenario = data.scenario;
        var selectedRow = 0;

        $scope.scenarioList = [
            { id: 1, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 2, name: 'Scenario Title (RESULTS NOT CALCULATED)', color: 'ff2f92', label: 'Al', type: 'not-calculated' },
            { id: 3, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 4, name: 'Scenario Title (OUT OF SYNC)', color: 'ff9300', label: 'A', type: '' },
            { id: 5, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 6, name: 'Scenario Title', color: 'ff9300', label: 'A', type: '' },
            { id: 7, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 8, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 9, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 10, name: 'Scenario Title', color: '075895', label: 'S', type: ''}
        ];

        $scope.setRow = function(id){
            selectedRow = id;
        };

        $scope.showRow = function(row){
            return row === selectedRow;
        };

        $scope.close = function() {
            console.info("cancel");
            $modalInstance.dismiss('canceled');
        };
}]);