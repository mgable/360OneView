'use strict';

angular.module('fileManagerApp')
    .service('Modal', function Modal($rootScope) {
        var open = false;

        this.setStatus = function(status, which) {
            console.info(which)
            open = (status) ? which[0].id : false;
            $rootScope.$broadcast("modal", open);
        };
    });