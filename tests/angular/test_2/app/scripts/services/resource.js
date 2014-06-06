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

    // var config = {
    //     transformResponse: function(data, headers) {
    //         var data = JSON.parse(data);
    //         _.each(data.data, function(data) {
    //             data.search = [""]
    //             if (typeof data.type === "object") {
    //                 var obj;
    //                 for (var name in data.type) {
    //                     obj = data.type[name];
    //                 }
    //                 data.fileType = obj;
    //                 data.search.push(name);
    //             } else {
    //                 data.fileType = data.type;
    //             }

    //             if (data.masterSet) {
    //                 data.search.push("Master Set");
    //             }
    //             if (data.search.length > 1) {
    //                 data.search.shift()
    //             }

    //         })
    //         console.info("transformResponse:TRANSFORMED")
    //         console.info(data);
    //         return data;
    //     },
    //     transformRequest: function(data, headers) {
    //         if (data) {
    //             if (angular.isArray(data)) {
    //                 _.each(data, function(data) {
    //                     console.info(data)
    //                 })
    //             } else if (angular.isObject(data)) {

    //                 var search = _.without(data.search, "Master Set"),
    //                     result = {};

    //                 if (search.length > 0) {
    //                     result[search] = data.fileType;
    //                     data.fileType = result;
    //                 }
    //             }
    //             delete data.fileType;
    //             delete data.search;
    //             delete data.$$hashKey;
    //             delete data.isSelected;
    //             return JSON.stringify(data);
    //         }
    //         return data;
    //     }
    // };

    /* Record retrieval */

    Resource.prototype.get = function(uid) {
        var deferred = Q.defer();

        this._http
            .get(this.path(uid))
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
        console.info("setting from resources");
        console.info(item);
        this._http
            .put(path, item)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    Resource.prototype.remove = function(ids) {
        var deferred = Q.defer();

        angular.extend(config, {
            params: {
                ids: ids
            }
        })

        this._http
            .delete(this._path)
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