/* jshint newcap:false */

'use strict';

angular.module('test1App')
    .service('Resource', function($resource, SERVER) {
        return $resource(SERVER, {}, {
            'login': {
                method: 'GET',
                url: SERVER + '/:path/:username/:password',
                params: {
                    path: 'login'
                }
            },
            'fetch': {
                method: 'GET',
                url: SERVER + '/:endpoint',
                params: {
                    endpoint: '@endpoint'
                }
            }
        });
    }).service('Fetch', function(Resource, Data) {
        return function(menu) {
            return Data(Resource.fetch({
                endpoint: menu
            }));
        };
    }).service('Authenticate', function(Resource, Data) {
        return function(user, pass) {
            return Data(Resource.login({
                username: user,
                password: pass
            }));
        };
    }).service('Data', function($q) {
        return function(data) {
            var defer = $q.defer();
            data.$promise.then(
                function(data) {
                    return defer.resolve(data.data);
                },
                function(data) {
                    return defer.reject(data.data);
                }
            );
            return defer.promise;
        };
    });