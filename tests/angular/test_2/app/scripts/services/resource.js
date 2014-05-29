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

    angular.module('filemanagerApp').factory('Resource', Resource.$factory);

    /* Record retrieval */

    Resource.prototype.get = function(uid) {
        var deferred = Q.defer();

        this._http
            .get(this.path(uid))
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.path = function(uid) {
        return uid ? this._path + '/' + uid : this._path;
    };

    Resource.prototype.set = function(uid, newValue) {
        var deferred = Q.defer();
        var path = this._path + '/' + uid;

        this._http
            .put(path, newValue)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.remove = function(ids) {
        var deferred = Q.defer();

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

    Resource.prototype.clone = function(id) {
        var deferred = Q.defer(),
            path = this._path + '/' + id;

        this._http
            .post(path, {
                params: {
                    id: id
                }
            })
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

})();