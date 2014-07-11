'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, $rootScope, $filter, FilesModel, SortAndFilterService, SEARCHITEMS, FileDeleteService, DialogService, DropdownService) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
        $scope.seeAll = false;
        $scope.selectedCategory = $scope.menuItems[0].label;
        $scope.enableDisplayActions = false;
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.SortAndFilterService.activeFilters.search = $scope.menuItems[0].label;
        $scope.FileDeleteService = FileDeleteService;
        $scope.DropdownService = DropdownService;

        $scope.setAsMaster = function(item) {
            var id = item.id,
                value = item.defaultScenariosElements
                console.info(id, value)
                FilesModel.update({
                    prop: 'defaultScenariosElements',
                    value: !value,
                    id: id
                });
            $scope.FileDeleteService.reset();
        };

        $scope.toggleInfoTray = function() {
            if ($scope.enableDisplayActions == 1) {
                $scope.showinfotray = !$scope.showinfotray;
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

        $scope.delete = function() {
            DialogService.create('/views/modal/delete.html', 'DialogCtrl');
        }

        $scope.setFilter = function(filter, other) {
            $scope.selectedCategory = other ? (typeof other === "boolean" ? filter : other) : filter;

            if (other) {
                SortAndFilterService.activeFilters.search = filter;
                SortAndFilterService.activeFilters.type = (typeof other === 'string') ? other : '';
            } else {
                SortAndFilterService.activeFilters.search = '';
                SortAndFilterService.activeFilters.type = filter === 'All' ? '' : filter;
            }
            $rootScope.$broadcast('$filter');
            $scope.closeInfoTray();
        }
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
    });