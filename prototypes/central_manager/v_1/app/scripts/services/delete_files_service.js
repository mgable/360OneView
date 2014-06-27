/* global _ */

'use strict';

angular.module('centralManagerApp')
    .service('FileDeleteService', function Service(FilesModel, $rootScope) {
        var filesToDelete = [],
            reset = false;

        this.setFilesToDelete = function(files) {
            filesToDelete = files;
            $rootScope.$broadcast('FileDeleteService:change');
        };

        this.getFilesToDelete = function() {
            return filesToDelete;
        };

        this.remove = function() {
            this.deleteFiles(_.pluck(filesToDelete, 'id'));
            this.reset();
        };

        this.deleteFiles = function(files) {
            FilesModel.$delete(files);
        };

        this.getFileCount = function() {
            return filesToDelete.length;
        };

        this.reset = function() {
            reset = true;
            filesToDelete = [];
            $rootScope.$broadcast('FileDeleteService:change');
        };

        this.resetReset = function() {
            reset = false;
        };

        this.getReset = function() {
            return reset;
        };
    });