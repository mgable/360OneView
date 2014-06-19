'use strict';

angular.module('fileManagerApp')
    .service('Modal', function Modal($rootScope) {
        var isOpen = false;

        this.setStatus = function(trueOrFaLse, which) {
            isOpen = (trueOrFaLse) ? which[0].id : trueOrFaLse;
            $rootScope.$broadcast("modal", isOpen);
        };
    });