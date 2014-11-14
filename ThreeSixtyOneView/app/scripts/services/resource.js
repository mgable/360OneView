/* global angular, _ */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", ["$http", "$q", "$rootScope", "EVENTS", function($http, $q, $rootScope, EVENTS){
        function Resource(http, q, path){
            this._http = http;
            this._path = this._basePath = path;
            this._q = q;
            var getPath = function (map){
                return map ? replaceParams(map, this._path) : this._path;
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

            this.getPath = function(){
                return this._basePath;
            };

            this.get = function(uid, _config_){
                var deferred = this._q.defer(), config = _config_ || {};

                this._http
                    .get(getPath.call(this, uid), config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };

            this.post = function(data, _config_, params) {
                var deferred = this._q.defer(), path, config = _config_ || {};

                if (typeof data === 'undefined') {
                    deferred.reject('I need an item template');
                    return deferred.promise;
                }

                path = params ? getPath.call(this, params) : this._path;

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
                var deferred = this._q.defer(), config = _config_ || {}, path;

                if (typeof data === 'undefined') {
                    deferred.reject('I need an data with an id');
                    return deferred.promise;
                }

                console.info(data, _config_, params, additionalPath);
                path = params ? getPath.call(this, params) : this._path;
                path = additionalPath ? path + "/" +  additionalPath : path;

                this._http
                    .put(path, data, config)
                    .success(deferred.resolve)
                    .error(function(data, status, headers, config){
                        $rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
                    });

                return deferred.promise;
            };

            this.delete = function(item, _config_){
                var deferred = this._q.defer(), config = _config_ || {};

                if (typeof item === 'undefined') {
                    deferred.reject('I need an item with an id');
                    return deferred.promise;
                }

                this._http
                    .delete(this._path, item, config)
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