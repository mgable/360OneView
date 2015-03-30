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
            scope, 
            EVENTS,
            $rootScope,
            cancelButton,
            submitButton,
            actionButton,
            inputField;

        beforeEach(inject(function(_$rootScope_, $compile, _EVENTS_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            scope.item = {};
            scope.item.name = "the title";
            scope.submitaction = "renameProject";
            EVENTS = _EVENTS_;
            element = angular.element('<inline-edit template="inline_rename" item=item submitAction=submitaction></inline-edit>');
            element = $compile(element)(scope);
            scope.$digest();
            cancelButton = element.find(".edit .cancel");
            submitButton = element.find(".edit .submit");
            actionButton = element.find(".noEdit");
            inputField = element.find(".edit input");
        }));

        it('should correctly set the title', function() {
            var title = element.find(".noEdit .title");
            expect(title.text()).toBe(scope.item.name);
            title = element.find("input");
            expect(title.val()).toEqual(scope.item.name);
        });

        it('should hide the input field on start', function() {
            var noEditHolder = element.find(".noEdit"),
                editHolder = element.find(".edit");
            expect($(noEditHolder).hasClass('ng-hide')).toEqual(false);
            expect($(editHolder).hasClass('ng-hide')).toEqual(true);
        });

        it("should fire the action when clicked", function(){
            spyOn($rootScope, "$broadcast");
            expect(element.isolateScope().isActive).toBe(false);
            actionButton.click();
            expect(element.isolateScope().isActive).toBe(true);
            expect($rootScope.$broadcast).toHaveBeenCalledWith(EVENTS.newSelectedItem);
        });

        it("should fire the submit action when clicked", function(){
            spyOn($rootScope, "$broadcast");
            element.isolateScope().isActive = true;
            expect(element.isolateScope().isActive).toBe(true);
            submitButton.click();
            expect(element.isolateScope().isActive).toBe(false);
            expect($rootScope.$broadcast).toHaveBeenCalledWith("ProjectsService:rename", scope.item);
        });

        it("should reset the form to prestine when submitted", function(){
            spyOn(element.isolateScope().form, "$setPristine");
            actionButton.click();
            inputField.val("x");
            submitButton.click();
            expect(element.isolateScope().form.$setPristine).toHaveBeenCalled();
        });

        it("should reset the form to prestine when cancelled", function(){
            spyOn(element.isolateScope().form, "$setPristine");
            actionButton.click();
            cancelButton.click();
            expect(element.isolateScope().form.$setPristine).toHaveBeenCalled();
        });

        it("should fire cancel action when clicked", function(){
            expect(element.isolateScope().isActive).toBe(false);
            cancelButton.click();
            expect(element.isolateScope().isActive).toBe(false);
        });
    });
});