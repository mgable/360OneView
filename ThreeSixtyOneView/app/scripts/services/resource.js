/* global angular, _ */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", ["$http", "$q", "$rootScope", "EVENTS", function($http, $q, $rootScope, EVENTS){
        function Resource(http, q, path){
            this._http = http;
            this._path = this._basePath = path;
            this._q = q;
            var getPath = function (params, additionalPath){
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
            };

            this.setPath = function (_path_){
                this._path = this._basePath + "/" +  _path_;
            };

            this.get = function(params, _config_, additionalPath){
                var deferred = this._q.defer(), config = _config_ || {},
                    path = getPath.call(this, params, additionalPath);

                this._http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };

            this.post = function(data, _config_, params, additionalPath) {
                var deferred = this._q.defer(), config = _config_ || {},
                    path = getPath.call(this, params, additionalPath);

                if (typeof data === 'undefined') {
                    deferred.reject('I need an item template');
                    return deferred.promise;
                }

                this._http
                    .post(path, data, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };

            //Alias for now
            this.create = this.post;

            this.put = function(data, _config_, params, additionalPath) {
                var deferred = this._q.defer(), config = _config_ || {},
                    path = getPath.call(this, params, additionalPath);

                if (typeof data === 'undefined') {
                    deferred.reject('I need an data with an id');
                    return deferred.promise;
                }

                this._http
                    .put(path, data, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };

            this.delete = function(query, _config_, params, additionalPath){
                var deferred = this._q.defer(), config = _config_ || {},
                    path = getPath.call(this, params, additionalPath);

                if (typeof query === 'undefined') {
                    deferred.reject('I need an query with an id');
                    return deferred.promise;
                }

                _.extend(config, query);

                this._http
                    .delete(path, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };
        }

        return function (path){
            return new Resource ($http, $q, path);
        };
    }]);