'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<display-actions show=["create"]></display-actions>');
        element = $compile(element)(scope);
        scope.$digest();
        button = element.find(".actions span");
    }));

    describe("Display Actions:", function() {
        it("should have an enabled create button", function() {
            expect(button).toBeDefined();
            expect(button.length).toBe(1);
        });

        it("should open the dialog box when the create button is clicked", function() {
            var spy = spyOn(scope, "create");
            button.click();
            expect(spy).toHaveBeenCalledWith('project')
        });
    });
});