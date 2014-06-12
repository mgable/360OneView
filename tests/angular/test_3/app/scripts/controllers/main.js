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
        $scope.hideScenarios = false;

        // set the default selected item
        $scope.FilterService.filterBy = $scope.filterBy[0].filter;

        // Multiple file delete
        $scope.$watch(FileDeleteService.getFileCount, function() {
            $scope.filesToDeleteCount = FileDeleteService.getFileCount();
        });

        $scope.$watch(FileDeleteService.getFilesToDelete, function() {
            $scope.filesToDelete = FileDeleteService.getFilesToDelete();
        });

        $scope.deleteFiles = function() {
            FileDeleteService.remove();
        }

        $scope.dontPassEvent = function(evt) {
            evt.stopPropagation();
        };

        //TODO: clean this up
        $scope.setAsMaster = function(config) {
            var config = config.split(',');
            var id = config[0],
                value = (config[1] === 'true') ? true : false;

            console.info(id, value)
            FilesModel.update({
                prop: 'masterSet',
                value: !value,
                id: id
            });
        };

        $scope.toggleScenarioView = function(evt) {
            $scope.dontPassEvent(evt);
            $scope.hideScenarios = $scope.hideScenarios === false ? true : false;
        };

        $scope.deleteSingleFile = function(id) {
            FileDeleteService.setFilesToDelete([{
                id: id
            }]);
            $scope.deleteFiles();
        };

        $scope.cloneFile = function(id) {
            FilesModel.$clone(id);
        };

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