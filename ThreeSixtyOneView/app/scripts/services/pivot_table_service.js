// create a data service that provide pivotable data
angular.module('ThreeSixtyOneView')
    .service('pivotableService', function($q, $timeout, $http) {
            this.fetch = function(url) {
                var deferred = $q.defer();
                var url = "data/" + url + ".json"
                $timeout(function() {
                    $http.get(url).success(function(data) {
                        deferred.resolve(data);
                    });
                }, 30);
                return deferred.promise;
            }
    });