/* global angular, EventEmitter, _, Q */

(function() {
    'use strict';

    function Files(futureFilesData) {
        this.$unwrap(futureFilesData);
    }

    Files.$factory = [
        '$timeout',
        'Resource',
        'SERVER',
        function($timeout, Resource, SERVER) {
            _.extend(Files, {
                $$resource: new Resource(SERVER + '/api/item'),
                $timeout: $timeout
            });

            return Files;
        }
    ];

    angular.module('filemanagerApp').factory('FilesFactory', Files.$factory);

    Files.$find = function(uid) {
        Files.data = new Files(this.$$resource.get(uid));
    };

    Files.$get = function() {
        return Files.data;
    }

    Files.$clone = function(id) {
        Files.$$resource.clone(id).then(function(response) {
            Files.$timeout(function() {
                Files.data.data.push(response);
            });
        });
    }

    Files.$delete = function(ids) {
        Files.$$resource.remove(ids).then(function(response) {
            Files.$timeout(function() {
                Files.data.data = response.data;
            });
        })
    }

    Files.$edit = function(which) {
        Files.$$resource.set(which);
    }

    Files.$set = function(which) {
        Files.$edit(which);
    }

    Files.$create = function(config) {
        console.info("creating ")
        console.info(config);
        Files.$$resource.create(config).then(function(response) {
            Files.$timeout(function() {
                Files.data.data = response.data;
            });
        })
    }

    Files.prototype.$unwrap = function(futureFilesData) {
        var self = this;

        this.$futureFilesData = futureFilesData;
        this.$futureFilesData.then(function(data) {
            Files.$timeout(function() {
                _.extend(self, data);
            });
        });
    };
})();


/*
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

Files.remove = function(ids) {
    return Files.$$resource.remove(ids)
}

Files.clone = function(id) {
    return Files.$$resource.clone(id);
}

Files.query = function(start, end) {
    return new Files(this.$$resource.query(start, end));
}

Files.ask = function() {
    console.info("the current data is ");
    console.info(this);
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

*/