'use strict';

describe('Directives: Link Group', function() {

    // load the directive's module
    beforeEach(module('fileManagerApp'));

    var element,
        scope;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should initalize scope variables even when those variables NOT declared', inject(function($compile) {
        element = angular.element('<div link-group></div>');
        element = $compile(element)(scope);
        expect(scope.selectedItem).toEqual('none');
        expect(scope.activeSubMenu).toBeFalsy();
        expect(scope.radio).toBe(false);
        expect(scope.toggleSelected).toBeDefined();
    }));

    it('should initalize scope variables', inject(function($compile) {
        element = angular.element('<div link-group radio="true" firstSelected="all"></div>');
        element = $compile(element)(scope);
        expect(scope.selectedItem).toEqual('all');
        expect(scope.activeSubMenu).toBeFalsy();
        expect(scope.radio).toBeTruthy();
        expect(scope.toggleSelected).toBeDefined();
    }));

    it('should handle subMenu actions', inject(function($compile) {
        element = angular.element('<div link-group radio="true" firstSelected="all"></div>');
        element = $compile(element)(scope);
        scope.toggleSelected("item")
        expect(scope.activeSubMenu).toBeFalsy();
        scope.toggleSelected("item", "all")
        expect(scope.activeSubMenu).toBe('all');
        scope.toggleSelected("item", true);
        expect(scope.activeSubMenu).toBeTruthy();
        scope.toggleSelected("item", false);
        expect(scope.activeSubMenu).toBeFalsy();
    }));

    it('should handle selected item when radio is enabled', inject(function($compile) {
        element = angular.element('<div link-group radio="true" firstSelected="all"></div>');
        element = $compile(element)(scope);
        scope.toggleSelected("item")
        expect(scope.selectedItem).toBe('item');
        scope.toggleSelected("item")
        expect(scope.selectedItem).toBe('item');
    }));

    it('should handle selected item when radio is NOT enabled', inject(function($compile) {
        element = angular.element('<div link-group  firstSelected="all"></div>');
        element = $compile(element)(scope);
        scope.toggleSelected("item")
        expect(scope.selectedItem).toBe('item');
        scope.toggleSelected("item")
        expect(scope.selectedItem).toBe('none');
    }));
});