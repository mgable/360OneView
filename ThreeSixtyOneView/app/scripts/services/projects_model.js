/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').service('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "dialogs", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, dialogs){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.projects),
    responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator,
    translateObj = function(data, translator){
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
    },
    config = {
        transformResponse: function(data){ return {data:translateResponse(data, responseTranslator)}; },
        transformRequest: function(data){ return translateRequest(data, requestTranslator);}
    },
    translateRequest = function(request, translator){
        if (request && translator) {
            return JSON.stringify(translateObj(request, translator));
        }
        return request;
    },
    translateResponse = function (response, translator){
        var results, data;
        
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
                results.push(translateObj(e, responseTranslator));
            });
        } else if (_.isObject(data)){
            return translateObj(data, responseTranslator);
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
            var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
            self.data.splice(index, 1, response.data);
            $timeout(function(){
                 $rootScope.$broadcast("ProjectsModel:dataChange", {
                    data: self.data
                });

                // update active selection for data bind in tray
                $rootScope.$broadcast("ProjectsModel:rename", {
                    data: response.data
                });
            });
        });
    },
    self = this;

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

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
        var obj = (_.pick(data, 'title', 'description', 'id'));
        put.call(this, obj);
    };
}]);
