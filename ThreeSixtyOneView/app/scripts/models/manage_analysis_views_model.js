'use strict';

angular.module('ThreeSixtyOneView.services')
	.factory('ManageAnalysisViewsModel', ["$location", "Resource", "CONFIG", "SERVER", "$q", "$http", function ManageAnalysisViewsModel($location, Resource, CONFIG, SERVER, $q, $http) {

		var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.pivotview);

		return {
			resource: resource,
			config: {},
			data: [],
            get: function(params, _config_, additionalPath) {
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                $http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(data, status) {
                        deferred.resolve({'id': null, error: {code: status, message: data}});
                        return deferred.promise;
                    });

                return deferred.promise;
            }
		};
	}]);
