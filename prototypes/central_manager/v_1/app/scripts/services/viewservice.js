'use strict';

angular.module('centralManagerApp')
    .service('ViewService', function($rootScope) {
        var model;

        console.info("veiw service")

        this.setModel = function(which) {
            model = which;
            $rootScope.$broadcast('ViewService:modelChange', which);
        }

        this.getModel = function() {
            return model;
        }
    });