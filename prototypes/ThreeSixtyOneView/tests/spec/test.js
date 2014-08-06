'use strict';

describe('Directive: test', function() {

    // load the controller's module
    beforeEach(module('myapp'));

    beforeEach(module('my.templates'));

    var element,
        scope, $templateCache;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $compile, $templateCache) {
        scope = $rootScope.$new();
        element = angular.element('<test></test>');
        element = $compile(element)(scope);
        $templateCache = $templateCache
        scope.$digest();
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        console.info(element)
        expect(true).toBe(true);
    });
});