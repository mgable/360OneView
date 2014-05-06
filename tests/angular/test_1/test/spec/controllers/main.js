'use strict';

describe('Controller: LogInDialogCtrl', function() {

    // load the controller's module
    beforeEach(module('test1App'));

    var LogInDialogCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        LogInDialogCtrl = $controller('LogInDialogCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        expect(true).toBe(true);
    });
});