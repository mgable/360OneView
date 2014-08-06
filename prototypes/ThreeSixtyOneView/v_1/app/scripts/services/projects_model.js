/* global angular, _ */

(function() {
    'use strict';

    function Projects(futureData) {
        this.$unwrap(futureData);
    }

    Projects.$factory = [
        '$timeout',
        'Resource',
        'SERVER',
        '$rootScope',
        function($timeout, Resource, SERVER, $rootScope) {
            _.extend(Projects, {
                $$resource: new Resource(SERVER + '/api/projects'),
                $timeout: $timeout,
                $rootScope: $rootScope
            });

            return Projects;
        }
    ];

    angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', Projects.$factory);

    Projects.$find = function(uid) {
        Projects.data = new Projects(this.$$resource.get(uid));
    };

    Projects.$get = function() {
        return Projects.data;
    };

    Projects.$clone = function(id) {
        Projects.$$resource.clone(id).then(function(response) {
            Projects.$timeout(function() {
                Projects.data.data.push(response);
                Projects.$rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: Projects.data
                })
            });
        });
    };

    Projects.$delete = function(ids) {
        Projects.$$resource.remove(ids).then(function(response) {
            Projects.$timeout(function() {
                Projects.data.data = response.data;
                Projects.$rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: Projects.data
                })
            });
        });
    };

    Projects.$edit = function(item) {
        var index = Projects.getItemIndex(item);
        Projects.$$resource.set(item).then(function(response) {
            Projects.$timeout(function() {
                Projects.data.data[index] = response.data;
                Projects.$rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: Projects.data
                })
            });
        });
    };

    Projects.$set = function(item) {
        Projects.$edit(item);
    };

    Projects.$create = function(config) {
        Projects.$$resource.create(config).then(function(response) {
            Projects.$timeout(function() {
                console.info(response);
                Projects.data.data = response.data;
                Projects.data.counts = response.counts;
            });
        });
    };

    Projects.update = function(config) {
        var item = Projects.getItemById(config.id);
        if (item) {
            item[config.prop] = config.value;

            Projects.$set(item);
        }
    };

    Projects.getItemById = function(id) {
        var item = false,
            items = Projects.data.data;
        for (var x = 0, limit = items.length; x < limit; x++) {
            if (items[x].id === id) {
                return items[x];
            }
        }
        return item;
    };

    Projects.getItemIndex = function(item) {
        var index = false;
        for (var x = 0, limit = Projects.data.data.length; x < limit; x++) {
            if (item.id === Projects.data.data[x].id) {
                return x;
            }
        }
    }

    Projects.prototype.$unwrap = function(futureData) {
        var self = this;

        this.$futureData = futureData;
        this.$futureData.then(function(data) {
            Projects.$timeout(function() {
                _.extend(self, data);
            });
        });
    };
})();