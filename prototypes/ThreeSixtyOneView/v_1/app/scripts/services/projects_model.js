/* global angular, _ */
    'use strict';

    angular.module('ThreeSixtyOneView.services').service('ProjectsModel', function($timeout, $rootScope, Resource, CONFIG, SERVER){
        var resource = new Resource(SERVER.remote + CONFIG.application.api.projects),
        translator = CONFIG.application.models.ProjectsModel.translator, 
        data, futureData,
        config = {transformResponse: function(data){ return {data:translate(data, translator)} }},
        translate = function (data, translator){
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
        }, 
        unwrap = function(futureData) {
            var self = this;
            this.$futureData = futureData;
            this.$futureData.then(function(data) {
                $timeout(function() {
                    _.extend(self, data);
                });
            });
        };

        this.find = function(uid) {
            unwrap.call(this, resource.get(uid, config))
        };

        this.get = function() {
            return this.$futureData;
        };

        this.create = function(data) {
            resource.create(data, config).then(function(response) {
                $timeout(function() {
                    self.data.push(response.data);
                    $rootScope.$broadcast("ProjectsModel:dataChange", {
                        data: self.data
                    });
                });
            });
        };
    });



   

   
 
