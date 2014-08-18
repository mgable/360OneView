// Modal controllers

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('DeleteCtrl', function($scope, data, $modalInstance, FileDeleteService) {
        var callback = data;
        $scope.FileDeleteService = FileDeleteService;
        $scope.cancel = function() {
            console.info("cancel")
            FileDeleteService.reset();
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.delete = function() {
            console.info("delete")
            FileDeleteService.remove();
            callback();
            $modalInstance.close('delete');
        }; // end save
    }).controller('CreateCtrl', function($scope, $modalInstance, $location, FilesModel) {
        $scope.create = function(item) {
            console.info("create");
            FilesModel.$create({
                title: item.name,
                type: item.type,
                base: item.base,
                access: item.access
            });
            $modalInstance.dismiss('create');
            $location.path("/scenarioEdit")
        }; //

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        }; // end cancel
    }).controller('RenameCtrl', function($scope, $modalInstance, data) {
        var service = data.service;
        $scope.data = data.item;
        $scope.name = $scope.data.title;

        $scope.rename = function(name) {
            $scope.data.title = name;
            service.$set($scope.data)

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };
    }).controller('NameCtrl', function($scope, $modalInstance, data, ViewService) {
        var service = data.service;
        $scope.data = data.item;
        $scope.config = data.config
        $scope.name = $scope.data.title + " - copy";

        $scope.submit = function(name) {
            //$scope.data.title = name;
            //service.$set($scope.data)
            var service = ViewService.getModel();
            service.$clone(data.item.id, name);

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };
    }).controller('ProjectCreateCtrl', function($scope, $modalInstance, ProjectsModel) {
        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };

        $scope.create = function(item) {
            alert("this will take you to the create project work flow");
            ProjectsModel.$create({
                "name": item,
                "description" : "this is a test",
                "isMaster": false,
                "parentId": ""
            });
            $modalInstance.dismiss('create');
        };
    })