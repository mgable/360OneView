/* global angular, _ */

(function() {
    'use strict';

    function Projects(futureData) {
        this.$unwrap(futureData);
    }

    Projects.$factory = [
        '$timeout',
        '$rootScope',
        'Resource',
        'CONFIG',
        'SERVER',
        function($timeout, $rootScope, Resource, CONFIG, SERVER) {
            _.extend(Projects, {
                $$resource: new Resource(SERVER.remote + CONFIG.application.api.projects),
                $timeout: $timeout,
                $rootScope: $rootScope,
                translator: CONFIG.application.models.ProjectsModel.translator
            });

            return Projects;
        }
    ];

    angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', Projects.$factory);

    Projects.config = {
        transformResponse: function(data){ return {data:translate(data, Projects.translator)} }
    }

    function translate(data, translator){
        var results, data = JSON.parse(data);

        if (_.isArray(data)){
            results = [];
            _.each(data, function(e,i,a){
                results.push(translateObj(e)) 
            })
        } else if (_.isObject){
            return translateObj(data);
        }

        function translateObj(data){
            var result = {}, t;
            _.each(translator, function(k,v,o){
                t = data[k];
                if (typeof t !== "undefined") {
                    result[v] = t;
                } else if (_.isObject(k)){
                    result[v] = eval("data" + k.selector)
                }
            })
            return result;
        }
        return results
    }


    Projects.$find = function(uid) {
        Projects.data = new Projects(this.$$resource.get(uid, Projects.config));

    };

    Projects.$get = function() {
        return Projects.data;
    };

    Projects.$clone = function(id, name) {
        Projects.$$resource.clone(id, name).then(function(response) {
            Projects.$timeout(function() {
                Projects.data.push(response);
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
                Projects.data[index] = response.data;
                Projects.$rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: Projects.data
                })
            });
        });
    };

    Projects.$set = function(item) {
        Projects.$edit(item);
    };

    Projects.$create = function(data) {
        Projects.$$resource.create(data, Projects.config).then(function(response) {
            Projects.$timeout(function() {
                Projects.data.data.push(response.data);
                Projects.$rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: Projects.data.data
                });
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
            items = Projects.data;
        for (var x = 0, limit = items.length; x < limit; x++) {
            if (items[x].id === id) {
                return items[x];
            }
        }
        return item;
    };

    Projects.getItemIndex = function(item) {
        var index = false;
        for (var x = 0, limit = Projects.data.length; x < limit; x++) {
            if (item.id === Projects.data[x].id) {
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