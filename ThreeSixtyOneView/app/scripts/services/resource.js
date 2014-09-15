/* global angular */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", function($http, $q){
        function Resource(http, q, path){
            this._http = http;
            this._path = path;
            this._q = q;
            var getPath = function (uid){
                return uid ? this._path + '/' + uid : this._path;
            };

            this.get = function(uid, con){
                var deferred = this._q.defer(), config = con || {};

                this._http
                    .get(getPath.call(this,uid), config)
                    .success(deferred.resolve)
                    .error(deferred.reject);

                return deferred.promise;
            };

            this.post = function(data, con) {
                var deferred = this._q.defer(), path, config = con || {};

                if (typeof data === 'undefined') {
                    deferred.reject('I need an item template');
                    return deferred.promise;
                }

                path = this._path;

                this._http
                    .post(path, data, config)
                    .success(deferred.resolve)
                    .error(deferred.reject);

                return deferred.promise;
            };

            //Alias for now
            this.create = this.post;

            this.put = function(params, con) {
                var deferred = this._q.defer(), config = con || {};

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

            this.delete = function(item, con){
                var deferred = this._q.defer(), config = con || {};

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