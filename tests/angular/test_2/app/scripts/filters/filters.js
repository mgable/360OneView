angular.module('filemanagerApp')
    .filter('capitalize', function() {
        return function(input, scope) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    })
    .filter('unCamelCase', function() {
        return function(input, scope) {
            return input.replace(/([a-z\d])([A-Z])/g, '$1 $2');
        }
    })
    .filter('escape', function() {
        return function(input, scope) {
            return input.replace(/'/g, "&apos;").replace(/"/g, '&quot;');
        }
    })