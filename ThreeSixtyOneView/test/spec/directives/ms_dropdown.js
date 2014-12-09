/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    describe("MS Dropdown:", function(){
        var $provide, state, scope, element, CONFIG, $httpBackend,  currentView, dropdownSpy, sortAndFilterSpy, DropdownService, SortAndFilterService, $document, $timeout;
       
        beforeEach(angular.mock.module(function (_$provide_) {
            $provide = _$provide_;
        }));

        beforeEach(inject(function($rootScope,  $controller, $compile, _$document_, _$timeout_, _CONFIG_, _DropdownService_, _SortAndFilterService_){
            SortAndFilterService = _SortAndFilterService_;
            DropdownService = _DropdownService_;
            $document = _$document_;
            $timeout = _$timeout_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            currentView = "ProjectManager";
            state = {};
            state.current = {"name": currentView};
            $provide.value("$state", state);
            element = angular.element('<ms-dropdown selected-sort-index="1" reverse=false msid="column_2"></ms-dropdown>');
            element = $compile(element)(scope);
            scope.$digest();
            sortAndFilterSpy = spyOn(SortAndFilterService, "setFilter");
        }));

        it("should compile", function(){
            expect(element).toBeDefined();
        });

        it("should correctly set the attributes", inject(function($compile){
            expect(element.isolateScope().reverse).toEqual('false');
            expect(element.isolateScope().id).toEqual("column_2");

            element = angular.element('<ms-dropdown is-active=true reverse=true msid="column_1"></ms-dropdown>');
            element = $compile(element)(scope);
            scope.$digest();

            expect(element.isolateScope().isActive).toEqual('true');
            expect(element.isolateScope().reverse).toEqual('true');
            expect(element.isolateScope().id).toEqual("column_1");
        }));

        it("should set the correct label", function(){
            expect(element.find("h6 .status").text()).toBe(CONFIG.view[currentView].sortMenu.displayColumns[0].label);
        });

        it("should reverse when clicked when active", function(){
            dropdownSpy = spyOn(DropdownService, "getActive").and.returnValue(element.isolateScope().id);
            element.find("h6 .status").click();
            expect(dropdownSpy).toHaveBeenCalled();
            expect(element.isolateScope().reverse).toEqual(true);
            expect(sortAndFilterSpy).toHaveBeenCalledWith('reverse', true, true);
            element.find("h6 .status").click();
            expect(element.isolateScope().reverse).toEqual(false);
            expect(sortAndFilterSpy).toHaveBeenCalledWith('reverse', false, true);
        });

        it("should not reverse when clicked when not active", function(){
            dropdownSpy = spyOn(DropdownService, "getActive").and.returnValue("foo");
            element.find("h6 .status").click();
            expect(element.isolateScope().selectedItem).toEqual(CONFIG.view[currentView].sortMenu.displayColumns[0]);
            expect(dropdownSpy).toHaveBeenCalled();
            expect(element.isolateScope().reverse).toEqual(false);
            expect(sortAndFilterSpy).toHaveBeenCalledWith('reverse', false, false);
        });

        it("should sort correctly", function(){
            dropdownSpy = spyOn(DropdownService, "setActive");
            var sortAndFilterSpySetSorter  = spyOn(SortAndFilterService, "setSorter");
            element.find("h6 .status").click();
            expect(dropdownSpy).toHaveBeenCalledWith("column_2");
            expect(sortAndFilterSpy.calls.count()).toEqual(3);
            expect(sortAndFilterSpy.calls.argsFor(0)).toEqual(["reverse", false, false]);
            expect(sortAndFilterSpy.calls.argsFor(1)).toEqual(["reset", "", false]);
            expect(sortAndFilterSpy.calls.argsFor(2)).toEqual(["orderBy", "modifiedOn", true]);
            expect(sortAndFilterSpySetSorter).toHaveBeenCalledWith("column_2", "Last Modified");
        });

        it ("should toggle correctly", function(){
            var toggleButton = element.find(".toggle"),
            dropDown = element.find('.ms-select-list'),
            docOnSpy = spyOn($document, "on"),
            docOffSpy = spyOn($document, "off");
            expect(toggleButton[0]).toBeDefined();
            expect(dropDown.hasClass("hide")).toBe(true);
            toggleButton.click();
            expect(dropDown.hasClass("hide")).toBe(false);
            $timeout.flush();
            expect(docOnSpy).toHaveBeenCalledWith("click", jasmine.any(Function));
            expect(docOffSpy).not.toHaveBeenCalled();
            toggleButton.click();
            docOnSpy.calls.reset();
            expect(dropDown.hasClass("hide")).toBe(true);
            expect(docOffSpy).toHaveBeenCalledWith("click", jasmine.any(Function));
            expect(docOnSpy).not.toHaveBeenCalled();
        });

        it("should select correctly", function(){
            var selectButton = element.find(".select"),
            selectSpy = spyOn(element.isolateScope(), "select").and.callThrough(),
            dropdownSpy = spyOn(DropdownService, "setActive").and.callThrough();
            DropdownService.setActive("column_2");
            expect(element.isolateScope().reverse).toEqual('false');
            selectButton.click();
            expect(selectSpy).toHaveBeenCalledWith(CONFIG.view.ProjectManager.sortMenu.displayColumns[0]);
            expect(element.isolateScope().reverse).toEqual(true);
            expect(sortAndFilterSpy).toHaveBeenCalledWith("reverse", true, true);
            sortAndFilterSpy.calls.reset();
            selectButton.click();
            expect(element.isolateScope().selectedItem).toEqual(CONFIG.view.ProjectManager.sortMenu.displayColumns[0]);
            expect(sortAndFilterSpy).toHaveBeenCalledWith("reverse", false, true);
            expect(dropdownSpy).toHaveBeenCalledWith("column_2");
        });
    });

});