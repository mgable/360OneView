'use strict';

angular.module('fileManagerApp')
    .controller('FileManagerCtrl', function($scope) {
        // controller here

        // $scope.stop = function(evt) {
        //     $scope.stopPropagation(evt);
        // };

        // $scope.stopPropagation = function(evt) {
        //     evt.stopPropagation();
        // };
    })
    .controller('FileManagerDisplayCtrl', function($scope, FILTERBY, FileDeleteService, FilterService, FilesModel) {
        $scope.filterBy = FILTERBY;
        $scope.filesToDeleteCount = FileDeleteService.getFileCount();
        $scope.data = FilesModel.$get();

        $scope.clearCreatedBy = function(filterBy) {
            if (filterBy === null) {
                delete FilterService.activeFilters.createdBy;
            }
        };
    })
    .controller('FileManagerSearchCtrl', function($scope, SEARCHITEMS) {
        $scope.menuItems = SEARCHITEMS;
    });