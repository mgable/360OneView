'use strict';

function Files(futureFilesData) {
    this.unwrap(futureFilesData);
}

Files.prototype.unwrap = function(futureFilesData) {
    var self = this;

    this.$futureFilesData = futureFilesData;
    this.$futureFilesData.then(function(response) {
        Files.$timeout(function() {
            angular.extend(self, response);
        });
    });
};

Files.get = function(id) {
    return new Files(this.$$resource.get(id));
};

Files.set = function(id, data) {
    return Files.$$resource.set(id, data);
}

Files.$factory = [
    '$timeout',
    //'Fetch',
    'Resource',
    'SERVER',
    function($timeout, Resource, SERVER) { //Fetch
        angular.extend(Files, {
            //$$resource: Fetch,
            $$resource: new Resource(SERVER + '/item'),
            $timeout: $timeout,
        });

        return Files;
    }
];



angular.module('filemanagerApp').factory('FilesFactory', Files.$factory);