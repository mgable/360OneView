/* global angular */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", function($http, $q){
        function Resource(http, q, path){
            this._http = http;
            this._path = path;
            this._q = q;
            var getPath = function (id){
                return id ? this._path.replace(/:id/, id) : this._path;
            };

            this.get = function(uid, _config_){
                var deferred = this._q.defer(), config = _config_ || {};

                this._http
                    .get(getPath.call(this, uid), config)
                    .success(deferred.resolve)
                    .error(deferred.reject);

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
                    .error(deferred.reject);

                return deferred.promise;
            };

            //Alias for now
            this.create = this.post;

            this.put = function(params, _config_) {
                var deferred = this._q.defer(), config = _config_ || {};

                if (typeof params === 'undefined') {
                    deferred.reject('I need an params with an id');
                    return deferred.promise;
                }

                this._http
                    .put(this._path, params, config)
                    .success(deferred.resolve)
                    .error(deferred.reject);

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
                    .error(deferred.reject);

                return deferred.promise;
            };
        }

        return function (path){
            return new Resource ($http, $q, path);
        };
    });