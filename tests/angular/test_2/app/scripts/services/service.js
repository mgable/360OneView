'use strict';

angular.module('filemanagerApp')
    .service('GroupFileDelete', function Service() {
        var filesToDelete = [],
            reset = false;

        this.setFilesToDelete = function(files) {
            filesToDelete = files
        }

        this.getFilesToDelete = function() {
            return filesToDelete;
        }

        this.getFileCount = function() {
            return filesToDelete.length;
        }

        this.reset = function() {
            reset = true;
            filesToDelete = [];
        }
        this.resetReset = function() {
            reset = false;
        }

        this.getReset = function() {
            return reset;
        }
    }).service("GetData", function($resource) {
        return $resource('http://127.0.0.1:3001/marketshare/filemanager', {}, {
            'query': {
                method: 'GET',
                isArray: false
            }
        });
    });