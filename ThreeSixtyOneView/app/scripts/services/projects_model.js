/* global angular, _ */
/* jshint unused: false */

    'use strict';

    angular.module('ThreeSixtyOneView.services').service('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "dialogs", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, dialogs){
        var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
        translator = CONFIG.application.models.ProjectsModel.translator,
        config = {transformResponse: function(data){ return {data:translate(data, translator)}; }},
        translate = function (response, translator){
            var results, data,
            translateObj = function(data){
                var result = {}, t;
                _.each(translator, function(k,v,o){
                    t = data[k];
                    if (typeof t !== "undefined") {
                        result[v] = t;
                    } else if (_.isObject(k)){
                        /* jshint ignore:start */
                        result[v] = eval("data" + k.selector);
                        /* jshint ignore:end */
                    }
                });
                return result;
            };

            try {
                data = JSON.parse(response);
            }
            catch(e){
                console.error ("no data received or data will not parse to json");
                dialogs.error("No data received!!!", "Either the server is down or the response is not JSON.");
                return;
            }

            if (_.isArray(data)){
                results = [];
                _.each(data, function(e,i,a){
                    results.push(translateObj(e));
                });
            } else if (_.isObject){
                return translateObj(data);
            }

            return results;
        },
        unwrap = function(futureData) {
            var self = this;
            this.$futureData = futureData;
            this.$futureData.then(function(data) {
                $timeout(function() {
                    _.extend(self, data);
                });
            });

        },
        // used for the rename functions
        put = function(data){
            resource.put(data, config).then(function(response){
                var item = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
                self.data.splice(item, 1, response.data);
                $timeout(function(){
                     $rootScope.$broadcast("ProjectsModel:dataChange", {
                        data: self.data
                    });
                });
            });
        },
        self = this;

        this.find = function(uid) {
            unwrap.call(this, resource.get(uid, config));
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

        this.rename = function(data){
            var obj = (_.pick(data, 'name', 'description'));
            obj.uuid = data.id;
            put.call(this, obj);
        };
    }]);
