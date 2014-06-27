'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('fileManagerApp'));

    beforeEach(module('my.templates'));

    var element, $httpBackend, scope, $element, ctrl;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        $httpBackend = $httpBackend;

    }));

    beforeEach(function() {
        this.addMatchers({
            toHaveClass: function(cls) {
                this.message = function() {
                    return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + cls + "'.";
                };

                return this.actual.hasClass(cls);
            }
        });
    });


    describe("Link Group:", function() {

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

    describe("Sorting Options", function() {
        beforeEach(inject(function($rootScope, $httpBackend, $compile, $controller) {
            scope = $rootScope.$new();

            $httpBackend = $httpBackend;
            $httpBackend.expectGET("http://127.0.0.1:3001/api/items").respond({
                hello: 'World'
            });
            element = angular.element('<sorter orderby="time"><div sorting-options label="mylabel"></div></sorter>');
            $compile(element)(scope);
            scope.$digest();

            // ctrl = $controller('SortingController', {
            //     $scope: scope,
            //     $element: null,
            //     $attrs: {
            //         label: "mylabel"
            //     }
            // });
        }));

        it("should correctly initialize", function() {
            expect(scope.reverse).toBe(false);
            // /expect(scope.label).toBe("mylabel");
            expect(scope.orderBy).toBe("time");
        });

        it("should correctly load the template", function() {
            var elm = element.find('span');
            expect(elm.length).toBe(1);
            expect(elm).toHaveClass('mylabel');
        });

        xit("should sort correctly", function() {
            var elm = element.find('span a'),
                sortSpy = spyOn(ctrl, "sort").andCallThrough();
            elm.click();
            expect(sortSpy).toHaveBeenCalled();
        });
    })
});