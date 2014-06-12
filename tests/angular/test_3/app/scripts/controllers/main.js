'use strict';

angular.module('fileManagerApp')
    .controller('FileManagerCtrl', function($scope) {
        // controller here
    })
    .controller('FileManagerDisplayCtrl', function($scope, FILTERBY, FileDeleteService, FilterService, FilesModel) {
        $scope.filterBy = FILTERBY;
        $scope.FilterService = FilterService;
        $scope.filesToDeleteCount = FileDeleteService.getFileCount();
        $scope.data = FilesModel.$get();

        // set the default selected item
        $scope.FilterService.filterBy = $scope.filterBy[0].filter;

        // Multiple file delete
        $scope.$watch(FileDeleteService.getFileCount, function() {
            $scope.filesToDeleteCount = FileDeleteService.getFileCount();
        });

        $scope.deleteFiles = function() {
            FileDeleteService.remove();
        }

        $scope.$watch(FileDeleteService.getFilesToDelete, function() {
            $scope.filesToDelete = FileDeleteService.getFilesToDelete();
        });

        $scope.dontPassEvent = function(evt) {
            evt.stopPropagation();
        };

        $scope.setAsMaster = function(id) {
            // if (item.masterSet) {
            //     item.search.splice(_.indexOf(item.search, "Master Set"), 1)
            // } else {
            //     item.search.push('Master Set');
            // }

            // item.masterSet = !item.masterSet;
            // FilesModel.$edit(item);
            FilesModel.update({
                prop: 'masterSet',
                value: true,
                id: id
            });
        }

        // $scope.getItemById = function(id, items) {
        //     console.info(items);
        //     var item = false;
        //     for (var x = 0, limit = items.length; x < limit; x++) {
        //         console.info(items[x], id)
        //         if (items[x].id === id) {
        //             return items[x];
        //         }
        //     }
        //     return item;
        // };
    })
    .controller('FileManagerSearchCtrl', function($scope, SEARCHITEMS, FilterService, $rootScope) {
        $scope.menuItems = SEARCHITEMS;
        $scope.FilterService = FilterService;

        $scope.setFilter = function(filter, other) {
            if (other) {
                FilterService.activeFilters.search = filter;
                FilterService.activeFilters.fileType = (typeof other === 'string') ? other : '';
            } else {
                FilterService.activeFilters.search = '';
                FilterService.activeFilters.fileType = filter === 'All' ? '' : filter;
            }
            $rootScope.$broadcast('$filter');
        }
    }).controller('SortingController', function($scope) {
        $scope.reverse = false;

        this.sort = function(which) {
            $scope.orderBy = which;
        }
    });