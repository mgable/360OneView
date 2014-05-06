'use strict';

function Stooges(futureStoogesData) {
    this.unwrap(futureStoogesData);
}

Stooges.prototype.unwrap = function(futureStoogesData) {
    var self = this;

    this.$futureStoogesData = futureStoogesData;
    this.$futureStoogesData.then(function(data) {
        Stooges.$timeout(function() {
            angular.extend(self, data);
        });
    });
};

Stooges.get = function() {
    return new Stooges(this.$$resource('test'));
};

Stooges.$factory = [
    '$timeout',
    'Fetch',
    function($timeout, Fetch) {
        angular.extend(Stooges, {
            $$resource: Fetch,
            $timeout: $timeout,
        });

        return Stooges;
    }
];

angular.module('test1App').factory('StoogesFactory', Stooges.$factory);