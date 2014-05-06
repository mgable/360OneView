'use strict';

angular.module('test1App')
    .service('Pagemanager', function(MenuFactory, Permissionsmanager, $location) {
        this.view = function(scope, destination) {
            if (Permissionsmanager.getLogin()) {
                scope.menuItems = MenuFactory.get(destination);
            } else {
                $location.path('/');
            }
        };
    });