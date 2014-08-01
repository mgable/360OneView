'use strict';

angular.module('centralManagerApp')
    .controller('MainCtrl', function($scope, SortAndFilterService, FileDeleteService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ProjectsModel) {
        // this is the services layer
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;
        $scope.FavoritesService = FavoritesService;

    })
    .controller('CentralManagerCtrl', function($scope, FilesModel, CENTRALMANAGER, SortAndFilterService, ViewService) {

        $scope.masterClass = "scenario-elements";

        FilesModel.$get().$futureFilesData.then(function(response) {
            $scope.$apply(SortAndFilterService.init({
                data: response,
                orderBy: 'Last Modified',
                filter: CENTRALMANAGER.items[0],
                reverse: true
            }));
        });

        ViewService.setModel(FilesModel);

        $scope.console = function(msg) {
            console.info(msg);
        }

        $scope.alert = function(msg) {
            alert(msg);
        }

        $scope.setAsMaster = function(item) {
            var id = item.id,
                value = item.defaults;

            FilesModel.update({
                prop: 'defaults',
                value: !value,
                id: id
            });
        };
    }).controller("ScenarioEditCtrl", function($scope) {
        $scope.foo = "bar";
    }).controller("ProjectManagerCtrl", function($scope, ProjectsModel, SortAndFilterService, PROJECTMANAGER, ViewService) {

        $scope.masterClass = "projects";

        ProjectsModel.$get().$futureProjectsData.then(function(response) {
            $scope.data = response;
            $scope.$apply(SortAndFilterService.init({
                data: response,
                orderBy: 'Last Modified',
                filter: PROJECTMANAGER.items[0],
                reverse: true
            }));
        });

        console.info("ScenarioEditCtrl")
        ViewService.setModel(ProjectsModel);

    }).controller('InfoTrayCtrl', function($scope, ActiveSelection) {
        $scope.selectedItem = ActiveSelection.getActiveItem();
        $scope.seeAll = false;

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }
        });

    }).controller('SearchCtrl', function($scope, SortAndFilterService, CENTRALMANAGER) {
        $scope.setFilter = SortAndFilterService.setFilter;
        $scope.menuItems = CENTRALMANAGER;
    }).controller('ProjectsSearchCtrl', function($scope, SortAndFilterService, PROJECTMANAGER) {
        $scope.setFilter = SortAndFilterService.setFilter;
        $scope.menuItems = PROJECTMANAGER;
    }).controller('DeleteCtrl', function($scope, data, $modalInstance, FileDeleteService) {
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
    }).controller('RenameCtrl', function($scope, $modalInstance, FilesModel, data) {
        var service = data.service;
        $scope.data = data.item;
        $scope.name = $scope.data.title;

        console.info(data);

        $scope.rename = function(name) {
            $scope.data.title = name;
            service.$set($scope.data)

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };
    }).controller('ProjectCreateCtrl', function($scope, $modalInstance) {
        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };

        $scope.create = function(item) {
            alert("this will take you to the create project work flow")
            $modalInstance.dismiss('create');
        };
    })