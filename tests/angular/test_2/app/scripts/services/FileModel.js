'use strict';

function Files(futureFilesData) {
    this.unwrap(futureFilesData);
}

Files.prototype.unwrap = function(futureFilesData) {
    var self = this;

    this.$futureFilesData = futureFilesData;
    this.$futureFilesData.then(function(data) {
        Files.$timeout(function() {
            angular.extend(self, data);
        });
    });
};

Files.get = function() {
    return new Files(this.$$resource());
};

Files.$factory = [
    '$timeout',
    'Fetch',
    function($timeout, Fetch) {
        angular.extend(Files, {
            $$resource: Fetch,
            $timeout: $timeout,
        });

        return Files;
    }
];

angular.module('filemanagerApp').factory('FilesFactory', Files.$factory);