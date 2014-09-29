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
            var newProject = CONFIG.view.ProjectManager.newProject;
            newProject.title = title;
            // create the new project
            //TODO: refactor this to an event
            ProjectsModel.create(newProject);
            $modalInstance.dismiss('create');
        };
    }]);