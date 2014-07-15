'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, $rootScope, $filter, $timeout, FilesModel, SortAndFilterService, SEARCHITEMS, FileDeleteService, DialogService, DropdownService, ActiveSelection) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
        $scope.seeAll = false;
        $scope.selectedCategory = $scope.menuItems[0].label;
        $scope.enableDisplayActions = false;
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.SortAndFilterService.setReverse(true);
        $scope.SortAndFilterService.activeFilters.defaults = true;
        $scope.FileDeleteService = FileDeleteService;
        $scope.DropdownService = DropdownService;
        $scope.ActiveSelection = ActiveSelection;

        $scope.setAsMaster = function(item) {
            var id = item.id,
                value = item.defaultScenariosElements;

            FilesModel.update({
                prop: 'defaultScenariosElements',
                value: !value,
                id: id
            });
        };

        $scope.toggleInfoTray = function(item) {
            if ($scope.ActiveSelection.isActiveRow(item)) {
                $scope.showinfotray = false;
                $scope.ActiveSelection.clearActiveRow()
            } else {
                $scope.ActiveSelection.setActiveRow(item)
                $scope.showinfotray = true
            }
        };

        $scope.closeInfoTray = function() {
            $scope.showinfotray = false;
        }

        $scope.$on('FileDeleteService:change', function() {
            $scope.enableDisplayActions = FileDeleteService.getFileCount();
        });

        $scope.alert = function(msg) {
            alert(msg);
        }

        $scope.trash = function() {
            DialogService.create('/views/modal/delete.html', 'DialogCtrl');
        }

        $scope.create = function() {
            DialogService.create('/views/modal/create.html', 'CreateCtrl', {}, {
                size: 'sm'
            });
        }

        $scope.setFilter = function(filter) {
            $scope.selectedCategory = filter;

            if (filter === "defaults") {
                SortAndFilterService.activeFilters.defaults = true;
                SortAndFilterService.activeFilters.type = '';
            } else {
                SortAndFilterService.activeFilters.defaults = '';
                SortAndFilterService.activeFilters.type = filter;
            }

            $rootScope.$broadcast('$filter');
            $scope.closeInfoTray();
        }
    }).controller('InfoTrayCtrl', function($scope, ActiveSelection) {
        $scope.activeSelection = ActiveSelection;
        $scope.$on('activeRowChange', function() {
            $scope.item = $scope.activeSelection.getActiveRow()
        })

    }).controller('DialogCtrl', function($scope, $modalInstance, FileDeleteService) {

        $scope.FileDeleteService = FileDeleteService;
        $scope.cancel = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.delete = function() {
            console.info("delete")
            FileDeleteService.remove();
            $modalInstance.close('save');
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
    });