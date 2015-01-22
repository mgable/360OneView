'use strict';

angular.module('ThreeSixtyOneView.services')
    .factory('ScenarioCalculateModel', ["$location", "Resource", "CONFIG", "SERVER", "$q", "$http", function ScenarioCalculateModel($location, Resource, CONFIG, SERVER, $q, $http) {

        var resource = new Resource(SERVER[$location.host()] + CONFIG.application.api.scenarioAnalytics);

        return {
            resource: resource,
            config: {},
            data: [],
            get: function(params, _config_, additionalPath){
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                $http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        deferred.resolve({'id': parseInt(params.id), currentState: {completed: "not calculated", label: "not calculated"}});
                        return deferred.promise;
                    });

                return deferred.promise;
            }
        };

    }]);
