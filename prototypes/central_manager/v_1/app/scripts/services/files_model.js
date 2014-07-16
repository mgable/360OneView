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
                $$resource: new Resource(SERVER + '/api/items'),
                $timeout: $timeout
            });

            return Files;
        }
    ];

    angular.module('centralManagerApp').factory('FilesModel', Files.$factory);

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
                Files.data.counts = response.counts;
            });
        });
    };

    Files.$edit = function(item) {
        var index = Files.getItemIndex(item);
        console.info(index);
        Files.$$resource.set(item).then(function(response) {
            Files.$timeout(function() {
                Files.data.data[index] = response.data;
            })
        });
    };

    Files.$set = function(item) {
        Files.$edit(item);
    };

    Files.$create = function(config) {
        Files.$$resource.create(config).then(function(response) {
            Files.$timeout(function() {
                console.info(response);
                Files.data.data = response.data;
                Files.data.counts = response.counts;
            });
        });
    };

    // Files.update = function(config) {
    //     var item = Files.getItemById(config.id);
    //     if (item) {
    //         item[config.prop] = config.value;

    //         //TODO: move this logic elsewhere or refactor out
    //         if (config.prop === 'defaults') {
    //             if (item.defaults) {
    //                 item.search.push('Default Scenarios Elements');
    //             } else {
    //                 item.search.splice(_.indexOf(item.search, 'Default Scenarios Elements'), 1);
    //             }
    //         }
    //         Files.$set(item);
    //     }
    // };

    Files.getItemById = function(id) {
        var item = false,
            items = Files.data.data;
        for (var x = 0, limit = items.length; x < limit; x++) {
            if (items[x].id === id) {
                return items[x];
            }
        }
        return item;
    };

    Files.getItemIndex = function(item) {
        var index = false;
        for (var x = 0, limit = Files.data.data.length; x < limit; x++) {
            if (item.id === Files.data.data[x].id) {
                return x;
            }
        }
    }

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