/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    describe("Sortable Columns:", function(){
        var scope, element, displayBy;
        beforeEach(inject(function($rootScope, $compile, $httpBackend){
            scope = $rootScope.$new();
            scope.item = {
                modifiedOn: new Date(),
                createdBy: "me",
                type: "foo",
                modifiedBy: "you"
            };
            element = angular.element('<sortable-columns item="item" display-by="displayBy">');
        }));

        it("should display last modified correctly", inject(function($compile){
            scope.displayBy = 'Last Modified';
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find("span:eq(0)").text().trim()).toBe('less than a minute ago');
        }));

        it("should display Creator correctly", inject(function($compile){
            scope.displayBy = 'Creator';
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find("span").text()).toBe('me');
        }));

        it("should display Type correctly", inject(function($compile){
            scope.displayBy = 'Type';
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find("span").text()).toBe('foo');
        }));

        it("should display Modified By correctly", inject(function($compile){
            scope.displayBy = 'Modified By';
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find("span").text()).toBe('you');
        }));

        it("should fail correctly", inject(function($compile){
            scope.displayBy = 'xxxx';
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find("span").text()).toBe('FAIL');
        }));
    });
});
