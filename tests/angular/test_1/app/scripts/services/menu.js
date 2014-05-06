'use strict';


function Menu(futureMenuData) {
    this.unwrap(futureMenuData);
}

Menu.prototype.unwrap = function(futureMenuData) {
    var self = this;

    this.$futureMenuData = futureMenuData;
    this.$futureMenuData.then(function(data) {
        Menu.$timeout(function() {
            angular.extend(self, data);
        });
    });
};

Menu.get = function(menu) {
    return new Menu(this.$$resource(menu));
};

Menu.$factory = [
    '$timeout',
    'Fetch',
    function($timeout, Fetch) {
        angular.extend(Menu, {
            $$resource: Fetch,
            $timeout: $timeout,
        });

        return Menu;
    }
];

angular.module('test1App').factory('MenuFactory', Menu.$factory);