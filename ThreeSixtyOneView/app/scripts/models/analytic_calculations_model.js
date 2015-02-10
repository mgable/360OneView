'use strict';

angular.module('ThreeSixtyOneView.services')
    .factory('AnalyticCalculationsModel', ["$location", "Resource", "CONFIG", "SERVER", "$q", "$http", function AnalyticCalculationsModel($location, Resource, CONFIG, SERVER, $q, $http) {

        var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarioAnalytics),
            responseTranslator = function(_data) {
                angular.forEach(_data.runningStates, function(value, index) {
                    value.id = index + 1;
                    value.name = value.name.trim();
                    value.name = value.label.trim();
                });
                _data.currentState.name = _data.currentState.name.trim();
                _data.currentState.label = _data.currentState.label.trim();
                return _data;
            },
            config = {};

        return {
            responseTranslator: responseTranslator,
            resource: resource,
            data: [],

            get: function(params, _config_, additionalPath){
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                $http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(){
                        deferred.resolve({currentState: {completed: false, name: "not_calculated", label: "not calculated", state: "not_calculated"}});
                        return deferred.promise;
                    });

                return deferred.promise;
            },

            post: function(data, _config_, params, additionalPath) {
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                if (typeof data === 'undefined') {
                    deferred.reject('I need an item template');
                    return deferred.promise;
                }

                $http
                    .post(path, data, config)
                    .success(deferred.resolve)
                    .error(function(data, status){
                        deferred.resolve({currentState: {completed: status, label: "?"}});
                        return deferred.promise;
                    });

                return deferred.promise;
            }

        };

    }]);
