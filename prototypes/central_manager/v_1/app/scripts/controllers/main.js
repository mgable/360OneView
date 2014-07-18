'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, InfoTrayService, DiaglogService, FilesModel, SortAndFilterService, FileDeleteService, ActiveSelection) {
        $scope.data = FilesModel.$get();

        $scope.SortAndFilterService = SortAndFilterService;
        $scope.SortAndFilterService.setReverse(true);
        $scope.SortAndFilterService.setFilter('defaults');

        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;

        $scope.setAsMaster = function(item) {
            var id = item.id,
                value = item.defaults;

            FilesModel.update({
                prop: 'defaults',
                value: !value,
                id: id
            });
        };
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
    }).controller('CreateCtrl', function($scope, $modalInstance, FilesModel) {
        $scope.create = function(name) {
            console.info("create");
            FilesModel.$create({
                title: name
            });
            $modalInstance.dismiss('create');
        }; //

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        }; // end cancel
    }).controller('RenameCtrl', function($scope, $modalInstance, FilesModel, data) {
        $scope.data = data;

        $scope.rename = function(name) {
            $scope.data.title = name;
            FilesModel.$set($scope.data)

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };
    });