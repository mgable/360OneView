/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    describe("Inline Edit", function(){
        var element,
        ViewService,
        scope;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.item = {};
            scope.item.title = "the title";
            element = angular.element('<inline-edit template="inline_rename" item=item></inline-edit>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should correctly set the title', function() {
            var holder = element.find("h4.title:eq(0)");
            expect(holder.text()).toBe(scope.item.title);
            holder = element.find("input");
            expect(holder.val()).toEqual(scope.item.title);
        });


        it('should hide the input field on start', function() {
            var holder = element.find("h4");
            expect($(holder[0]).hasClass('ng-hide')).toEqual(false);
            expect($(holder[1]).hasClass('ng-hide')).toEqual(true);
        });

        it("should fire the action when clicked", function(){
            var holder = element.find(".edit");
            expect(element.isolateScope().isActive).toBe(false);
            holder.click();
            expect(element.isolateScope().isActive).toBe(true);
        });

        it("should fire cancel when clicked", function(){
            var cancelButton = element.find("h4:eq(1) a:eq(1)");
            expect(element.isolateScope().isActive).toBe(false);
            cancelButton.click();
            expect(element.isolateScope().isActive).toBe(false);
        });
    });
});