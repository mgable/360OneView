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

    var config = {
        transformResponse: function(data, headers) {
            var data = JSON.parse(data);
            _.each(data.data, function(data) {
                if (typeof data.fileType === "object") {
                    var obj, result = {}
                    for (var name in data.fileType) {
                        obj = data.fileType[name]
                    }
                    result[name] = obj;
                    data.fileType = obj;
                    data.search = name;
                } else {
                    data.search = "";
                }
            })
            console.info(data);
            return data;
        }
    };

    /* Record retrieval */

    Resource.prototype.get = function(uid) {
        var deferred = Q.defer();

        this._http
            .get(this.path(uid), config)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.query = function(start, end) {
        var deferred = Q.defer();

        this._http
            .get(this._path + "/" + start + "/" + end)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.path = function(uid) {
        return uid ? this._path + '/' + uid : this._path;
    };

    Resource.prototype.set = function(item) {
        var deferred = Q.defer();
        var path = this._path + '/' + item.id;

        this._http
            .put(path, item)
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

    Resource.prototype.create = function(data) {
        var deferred = Q.defer(),
            path = this._path

            this._http
                .post(path, {
                    params: {
                        data: data
                    }
                })
                .success(deferred.resolve)
                .error(deferred.reject);

        return deferred.promise;
    };

})();