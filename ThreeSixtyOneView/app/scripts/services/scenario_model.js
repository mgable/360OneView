/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').service('ScenarioModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "SERVER", "dialogs", function($timeout, $rootScope, $location, Resource, CONFIG, SERVER, dialogs){
    var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarios),
    responseTranslator = CONFIG.application.models.ScenarioModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator,
    translateObj = function(data, translator){
        var result = {}, t;
        _.each(translator, function(k,v,o){
            t = data[k];
            if (typeof t !== "undefined") {
                result[v] = t;
            } else if (_.isObject(k)){
                // k.replace(/([^\]]+\])/g, function(d, s){console.info ("hey " + s)});
                try{
                    /* jshint ignore:start */
                    result[v] = eval("data" + k.selector);
                    /* jshint ignore:end */
                } catch(e){
                    console.info (k.selector + " does not exist");
                }
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
    cache = {},
    self = this;

    this.get = function(uid) {
        if (cache[uid]) {
            return cache[uid];
        }
        unwrap.call(this, resource.get(uid, config));
        cache[uid] = this.$futureData;
        return this.$futureData;
    };

    // this.get = function() {
    //     return this.$futureData;
    // };


}]);
