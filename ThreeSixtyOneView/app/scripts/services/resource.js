/* global angular, _ */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", ["$http", "$q", "$rootScope", "EVENTS", function($http, $q, $rootScope, EVENTS) {
		function Resource(http, q, path) {
			this._http = http;
			this._path = this._basePath = path;
			this._q = q;
			var self = this,
			getPath = function (params, additionalPath){
				var path = additionalPath ? this._basePath + "/" +  additionalPath : this._basePath;
				path = replaceParams(params, path);
				return path;
			}, replaceParams = function(map, string){
				var url = string;
				_.each(map, function(e,i){
					// i is regex
					// e is replacement value
					var regExp = new RegExp(":" + i);
					url = url.replace(regExp, e);
				});
				// remove unreplaced tokens
				url = url.replace(/\/:[^\/]*/gi,"");
				return url;
			}, action = function(method, params, _config_, additionalPath, data) {
				var deferred = self._q.defer(), config = _config_ || {};

				if(method === 'POST' || method === 'PUT') {
					if(typeof data === 'undefined') {
						deferred.reject('I need an item template');
						return deferred.promise;
					}
					config.data = data;
				} else if(method === 'DELETE') {
					if(typeof data === 'undefined') {
						deferred.reject('I need a query with an id');
						return deferred.promise;
					}
					_.extend(config, data);
				}

				config.method = method;
				config.url = getPath.call(self, params, additionalPath);

				self._http(config)
					.success(deferred.resolve)
					.error(function(data, status, headers, config){
						$rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
						deferred.reject(arguments);
					});

				return deferred.promise;
			};

			this.getPath = getPath;

			this.setPath = function (_path_){
				this._path = this._basePath + "/" +  _path_;
			};

			this.get = function(params, _config_, additionalPath){
				return action('GET', params, _config_, additionalPath);
			};

			this.post = function(data, _config_, params, additionalPath) {
				return action('POST', params, _config_, additionalPath, data);
			};

			//Alias for now
			this.create = this.post;

			this.put = function(data, _config_, params, additionalPath) {
				return action('PUT', params, _config_, additionalPath, data);
			};

			this.delete = function(query, _config_, params, additionalPath) {
				return action('DELETE', params, _config_, additionalPath, query);
			};
		}

		return function (path) {
			return new Resource ($http, $q, path);
		};
	}]);