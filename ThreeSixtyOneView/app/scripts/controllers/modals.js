'use strict';

angular.module('ThreeSixtyOneView')
    .controller('DeleteCtrl', ["$scope", "data", "$modalInstance", "FileDeleteService", function($scope, data, $modalInstance, FileDeleteService) {
        var callback = data;
        $scope.FileDeleteService = FileDeleteService;
        $scope.cancel = function() {
            console.info("cancel");
            FileDeleteService.reset();
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.delete = function() {
            console.info("delete");
            FileDeleteService.remove();
            callback();
            $modalInstance.close('delete');
        }; // end save
    }]).controller('CreateCtrl', ["$scope", "$rootScope", "$modalInstance", function($scope, $rootScope, $modalInstance) {
        $scope.create = function(item) {
            $modalInstance.dismiss('create');
            $rootScope.$broadcast("CreateCtrl:create", item);
        };

        $scope.close = function() {
            console.info("cancel");
            $modalInstance.dismiss('canceled');
        }; // end cancel
    }]).controller('RenameCtrl', ["$scope", "$modalInstance", "data", function($scope, $modalInstance, data) {
        var service = data.service;
        $scope.data = data.item;
        $scope.name = $scope.data.title;

        $scope.rename = function(name) {
            $scope.data.name = name;
            service.rename($scope.data);

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel");
            $modalInstance.dismiss('canceled');
        };
    }]).controller('NameCtrl', ["$scope", "$modalInstance", "data", "ViewService", function($scope, $modalInstance, data, ViewService) {
        $scope.data = data.item;
        $scope.config = data.config;
        $scope.name = $scope.data.title + " - copy";

        $scope.submit = function(name) {
            var service = ViewService.getModel();
            service.$clone(data.item.id, name);
            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            $modalInstance.dismiss('canceled');
        };
    }]).controller('ProjectCreateCtrl', ["$scope", "$rootScope", "$modalInstance", "ProjectsModel", "CONFIG", function($scope, $rootScope, $modalInstance, ProjectsModel, CONFIG) {
        $scope.close = function() {
            $modalInstance.dismiss('canceled');
        };

        $scope.create = function(name) {
            var newProject = CONFIG.view.ProjectManager.newProject;
            newProject.name = name;
            ProjectsModel.create(newProject);
            $rootScope.$broadcast("ProjectCreateCtrl:create", newProject.name);
            $modalInstance.dismiss('create');
        };
    }]);