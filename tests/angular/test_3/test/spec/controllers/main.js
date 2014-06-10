'use strict';

describe('Controller: FileManagerCtrl', function() {

    // load the controller's module
    beforeEach(module('fileManagerApp'));

    var FileManagerCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        FileManagerCtrl = $controller('FileManagerCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        expect(scope).not.toBe(null);
    });
});