/* global angular, _ */

(function() {
    'use strict';

    function Files(futureFilesData) {
        this.$unwrap(futureFilesData);
    }

    Files.$factory = [
        '$timeout',
        'Resource',
        'SERVER',
        function($timeout, Resource, SERVER) {
            _.extend(Files, {
                $$resource: new Resource(SERVER + '/api/item'),
                $timeout: $timeout
            });

            return Files;
        }
    ];

    angular.module('fileManagerApp').factory('FilesModel', Files.$factory);

    Files.$find = function(uid) {
        Files.data = new Files(this.$$resource.get(uid));
    };

    Files.$get = function() {
        return Files.data;
    };

    Files.$clone = function(id) {
        Files.$$resource.clone(id).then(function(response) {
            Files.$timeout(function() {
                Files.data.data.push(response);
            });
        });
    };

    Files.$delete = function(ids) {
        Files.$$resource.remove(ids).then(function(response) {
            Files.$timeout(function() {
                Files.data.data = response.data;
            });
        });
    };

    Files.$edit = function(which) {
        Files.$$resource.set(which);
    };

    Files.$set = function(which) {
        Files.$edit(which);
    };

    Files.$create = function(config) {
        Files.$$resource.create(config).then(function(response) {
            Files.$timeout(function() {
                Files.data.data = response.data;
            });
        });
    };

    Files.prototype.$unwrap = function(futureFilesData) {
        var self = this;

        this.$futureFilesData = futureFilesData;
        this.$futureFilesData.then(function(data) {
            Files.$timeout(function() {
                _.extend(self, data);
            });
        });
    };
})();