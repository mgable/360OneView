'use strict';

angular.module('test1App')
    .service('Data', function Data($http) {
        this.jsonPUrl = function(endpoint) {
            return 'http://127.0.0.1:3001/marketshare/' + endpoint + '?callback=JSON_CALLBACK';
        };

        this.getMenu = function(menu) {
            var url = this.jsonPUrl(menu);

            return $http.jsonp(url).then(function(response) {
                return response.data.data;
            });
        };
    });