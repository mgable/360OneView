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

    }]).controller('ProjectCreateCtrl', ["$scope", "$rootScope", "$controller", "$modalInstance", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));
        var newProject = CONFIG.application.models.ProjectsModel.newProject;

        $scope.callback = function(){$rootScope.$broadcast(EVENTS.gotoDashboard, newProject);};

        $scope.create = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            newProject.title = title;

            $rootScope.$broadcast(EVENTS.createProject, newProject, $scope.callback);
            $modalInstance.dismiss('create');
        };
    }]).controller('CreateScenarioCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        $scope.scenario = data.scenario;
        var selectedRow = 0, getStatus = function (_id_){
            var element = _.findWhere($scope.scenarioList, {id: _id_});
            return element ? element.type !== 'not-calculated' : true ;
        };

        ScenarioService.getAll().then(function(response){
            $scope.scenarioList = response;
        });

        // $scope.scenarioList = [
        //     { id: 1, name: 'Scenario Title 1', color: 'ff2f92', label: 'Al', type: '' },
        //     { id: 2, name: 'Scenario Title (RESULTS NOT CALCULATED)', color: 'ff2f92', label: 'Al', type: 'not-calculated' },
        //     { id: 3, name: 'Scenario Title 2', color: 'ff2f92', label: 'Al', type: '' },
        //     { id: 4, name: 'Scenario Title (OUT OF SYNC)', color: 'ff9300', label: 'A', type: '' },
        //     { id: 5, name: 'Scenario Title 3', color: '075895', label: 'S', type: ''},
        //     { id: 6, name: 'Scenario Title 4', color: 'ff9300', label: 'A', type: '' },
        //     { id: 7, name: 'Scenario Title 5', color: '075895', label: 'S', type: ''},
        //     { id: 8, name: 'Scenario Title 6', color: 'ff2f92', label: 'Al', type: '' },
        //     { id: 9, name: 'Scenario Title 7', color: '075895', label: 'S', type: ''},
        //     { id: 10, name: 'Scenario Title 8', color: '075895', label: 'S', type: ''}
        // ];

        $scope.setRow = function(id){
            console.info(getStatus(id));
            if (getStatus(id)) {
                selectedRow = id;
            }
        };

        $scope.showRow = function(row){
            return row === selectedRow;
        };
}]);