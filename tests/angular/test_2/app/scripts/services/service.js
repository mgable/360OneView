'use strict';

angular.module('filemanagerApp')
    .service('GroupDelete', function Service() {
        var fileCount = 0,
            filesToDelete = [];

        this.setFilesToDelete = function(files) {
            filesToDelete = files
        }

        this.getFilesToDelete = function() {
            return filesToDelete;
        }

        this.setDeleteCount = function(total) {
            fileCount = total;
        }

        this.getDeleteCount = function() {
            return fileCount;
        }

        this.reset = function() {
            console.info("reset");
            this.setDeleteCount = 0;
            this.setFilesToDelete = "";
        }
    });