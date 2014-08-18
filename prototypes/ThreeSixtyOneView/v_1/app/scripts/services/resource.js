/* global angular, _, Q */

(function() {
    'use strict';

    /** Constructor  **/
    function Resource($http, path) {
        _.extend(this, {
            _http: $http,
            _path: path
        });
    }

    /* Factory */
    Resource.$factory = ['$http',
        function($http) {
            return function(path) {
                return new Resource($http, path);
            };
        }
    ];

    /* Registration */
    angular.module('ThreeSixtyOneView.services').factory('Resource', Resource.$factory);

    /* Record retrieval */
    Resource.prototype.get = function(uid, config) {
        var deferred = Q.defer(), config = config || {};
        this._http
            .get(this.path(uid), config)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.query = function(start, end) {
        var deferred = Q.defer();
        if (typeof start === 'undefined' || typeof end === 'undefined') {
            deferred.reject('I need a start and end');
            return deferred.promise;
            //throw new Error('I need a start and end');
        }

        this._http
            .get(this._path + '/' + start + '/' + end)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.set = function(item) {
        var deferred = Q.defer(),
            path;

        if (typeof item === 'undefined') {
            deferred.reject('I need an item with an id');
            return deferred.promise;
        }

        path = this._path + '/' + item.id;

        this._http
            .put(path, item)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.remove = function(ids) {
        var deferred = Q.defer();

        if (typeof ids === 'undefined') {
            deferred.reject('I need an array with a list of ids');
            return deferred.promise;
        }

        this._http
            .delete(this._path, {
                params: {
                    ids: ids
                }
            })
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.clone = function(id, name) {
        var deferred = Q.defer(),
            path;

        if (typeof id === 'undefined') {
            deferred.reject('I need an id');
            return deferred.promise;
        }

        path = this._path + '/' + id;
        this._http
            .post(path, {
                params: {
                    id: id,
                    name: name
                }
            })
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.create = function(data, config) {
        var deferred = Q.defer(),
            path;



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

    Resource.prototype.path = function(uid) {
        return uid ? this._path + '/' + uid : this._path;
    };

})();