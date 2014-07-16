'use strict';

angular.module('centralManagerApp')
    .factory('DialogService', function(dialogs) {
        // Service logic
        // ...

        // Public API here
        return {
            create: function(templateUrl, ctrl, scope, config) {
                var dlg = dialogs.create(templateUrl, ctrl, scope, config);
                dlg.result.then(function(user) {
                    //save
                }, function() {
                    //dismiss
                });
            }
        };
    });