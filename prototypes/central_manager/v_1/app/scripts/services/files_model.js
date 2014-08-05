/* global angular, _ */

(function() {
    'use strict';

    function Files(futureData) {
        this.$unwrap(futureData);
    }

    Files.$factory = [
        '$timeout',
        'Resource',
        'SERVER',
        '$rootScope',
        function($timeout, Resource, SERVER, $rootScope) {
            _.extend(Files, {
                $$resource: new Resource(SERVER + '/api/items'),
                $timeout: $timeout,
                $rootScope: $rootScope
            });

            return Files;
        }
    ];

    angular.module('ThreeSixtyOneView').factory('FilesModel', Files.$factory);

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
                Files.$rootScope.$broadcast("FilesModel:edit", {
                    data: response.data
                })
            });
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

    Files.update = function(config) {
        var item = Files.getItemById(config.id);
        if (item) {
            item[config.prop] = config.value;

            Files.$set(item);
        }
    };

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

    Files.prototype.$unwrap = function(futureData) {
        var self = this;

        this.$futureData = futureData;
        this.$futureData.then(function(data) {
            Files.$timeout(function() {
                _.extend(self, data);
            });
        });
    };
})();