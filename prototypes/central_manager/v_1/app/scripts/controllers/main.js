'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, $rootScope, $filter, $timeout, FilesModel, SortAndFilterService, SEARCHITEMS, FileDeleteService, DialogService, DropdownService, ActiveSelection, dialogs) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
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
                value = item.defaults;

            FilesModel.update({
                prop: 'defaults',
                value: !value,
                id: id
            });
        };

        $scope.toggleInfoTray = function(item) {
            if (item) {
                if ($scope.ActiveSelection.isActiveRow(item)) {
                    $scope.showinfotray = false;
                    $scope.ActiveSelection.clearActiveRow()
                } else {
                    $scope.ActiveSelection.setActiveRow(item)
                    $scope.showinfotray = true
                }
            } else {
                $scope.showinfotray = false;
                $scope.ActiveSelection.clearActiveRow()
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

        $scope.trash = function(item) {
            if (item) {
                FileDeleteService.setFilesToDelete([item]);
            }
            DialogService.create('/views/modal/delete.html', 'DialogCtrl');
        }

        $scope.copy = function(item) {
            var dlg = dialogs.confirm("Copy Entity", "Do you want to copy " + item.title + "?");
            dlg.result.then(
                function(btn) {
                    console.info(btn);
                    FilesModel.$clone(item.id);
                },
                function(btn) {
                    console.info(btn)
                }
            )
        }

        $scope.rename = function(item) {
            DialogService.create('/views/modal/rename.html', 'RenameCtrl', item, {
                size: 'sm'
            });
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
        $scope.seeAll = false;
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
            console.info("rename");
        // FilesModel.$create({
        //     title: name
        // });
            $scope.data.title = name;
            FilesModel.$set($scope.data)

            $modalInstance.dismiss('create');
        }; //

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        }; // end cancel
    });;