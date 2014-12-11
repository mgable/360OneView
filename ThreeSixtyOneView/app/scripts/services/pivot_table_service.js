'use strict';

// create a data service that provide pivotable data
angular.module('ThreeSixtyOneView')
.service('PivotTableService',
    function($q, $timeout, $http) {

        var messages = {
            error: 'Data Unavailable'
        };

        var url = 'data/empty.json';

        this.data = {};

        this.fetch = function(datafile) {
            var deferred = $q.defer();
            var self = this;

            if (datafile) {
                url = datafile;
            }

            $http.get(url)
            .success(function(data) {
                deferred.resolve(data);
                self.data = data;
            })
            .error(function() {
                deferred.reject(messages.error);
            });

            return deferred.promise;
        };
        
    }
);
