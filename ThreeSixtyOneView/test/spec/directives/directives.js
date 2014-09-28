/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    describe("Display Actions:", function() {

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.CONFIG = {};
            scope.CONFIG.displayActionsCreate = 'project';
            element = angular.element('<display-actions show=["create"]></display-actions>');
            element = $compile(element)(scope);
            scope.$digest();
            button = element.find(".actions span");
        }));

        it("should have an enabled create button", function() {
            expect(button).toBeDefined();
            expect(button.length).toBe(1);
        });

        it("should open the dialog box when the create button is clicked", function() {
            var spy = spyOn(scope, "create");
            button.click();
            expect(spy).toHaveBeenCalledWith(scope.CONFIG.displayActionsCreate);
        });
    });

    describe("MS Dropdown:", function(){
        var scope, element, CONFIG, $httpBackend, ViewService, ViewServiceSpy, currentView, dropdownSpy, sortAndFilterSpy, DropdownService, SortAndFilterService, $document, $timeout;
        beforeEach(inject(function($rootScope, $controller, $compile, _$document_, _$timeout_, _CONFIG_, ViewService, _DropdownService_, _SortAndFilterService_){
            SortAndFilterService = _SortAndFilterService_;
            DropdownService = _DropdownService_;
            $document = _$document_;
            $timeout = _$timeout_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            element = angular.element('<ms-dropdown selected-sort-index="1" reverse=false msid="column_2"></ms-dropdown>');
            element = $compile(element)(scope);
            currentView = "ProjectManager";
            ViewServiceSpy = spyOn(ViewService, "getCurrentView").and.returnValue(currentView);
            scope.$digest();
            sortAndFilterSpy = spyOn(SortAndFilterService, "setFilter");
        }));

        it("should compile", function(){
            expect(element).toBeDefined();
        });

        it("should correctly set the attributes", inject(function($compile){
            expect(element.isolateScope().selectedSortIndex).toEqual('1');
            expect(element.isolateScope().reverse).toEqual('false');
            expect(element.isolateScope().id).toEqual("column_2");

            element = angular.element('<ms-dropdown selected-sort-index="0" reverse=true msid="column_1"></ms-dropdown>');
            element = $compile(element)(scope);
            scope.$digest();

            expect(element.isolateScope().selectedSortIndex).toEqual('0');
            expect(element.isolateScope().reverse).toEqual('true');
            expect(element.isolateScope().id).toEqual("column_1");

        }));

        it("should set the correct label", function(){
            expect(element.find("h6 .status").text()).toBe(CONFIG.view[currentView].sortMenu.displayColumns[element.isolateScope().selectedSortIndex].label);
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
            element.isolateScope().selectedFilter = "foo";
            element.find("h6 .status").click();
            expect(element.isolateScope().selectedItem).toEqual(CONFIG.view[currentView].sortMenu.displayColumns[element.isolateScope().selectedSortIndex]);
            expect(dropdownSpy).toHaveBeenCalled();
            expect(element.isolateScope().reverse).toEqual(false);
            expect(sortAndFilterSpy).toHaveBeenCalledWith('reverse', false, false);
            expect(element.isolateScope().selectedFilter).toEqual('');
        });

        it("should sort correctly", function(){
            dropdownSpy = spyOn(DropdownService, "setActive");
            var sortAndFilterSpySetSorter  = spyOn(SortAndFilterService, "setSorter");
            element.find("h6 .status").click();
            expect(dropdownSpy).toHaveBeenCalledWith("column_2");
            expect(sortAndFilterSpy.calls.count()).toEqual(3);
            expect(sortAndFilterSpy.calls.argsFor(0)).toEqual(["reverse", false, false]);
            expect(sortAndFilterSpy.calls.argsFor(1)).toEqual(["reset", "", false]);
            expect(sortAndFilterSpy.calls.argsFor(2)).toEqual(["orderBy", "createdOn", true]);
            expect(sortAndFilterSpySetSorter).toHaveBeenCalledWith("column_2", "Created Date");
        });

        xit("should correctly detemine whether to load an additional template", function(){
            // additional templates removed for John Wayne
            expect(element.isolateScope().enabledOn({label: "foo"})).toBe(true);
            expect(element.isolateScope().enabledOn({label: "Modified by:"})).toBe(false);
        });

        xit("should properly load any additional templates", inject(function($compile){
            // additional templates removed for John Wayne
            var submitButton = element.find("button.submit-button");
            expect(submitButton.length).toBe(1);

            element = angular.element('<ms-dropdown selected-sort-index="0" reverse=true msid="column_1"></ms-dropdown>');
            element = $compile(element)(scope);
            scope.$digest();

            submitButton = element.find("button.submit-button");
            expect(submitButton.length).toBe(0);
        }));

        xit("should properly enabled and disabled the submit button", function(){
            // additional templates removed for John Wayne
            var submitButton = element.find("button.submit-button"),
            submitSpy = spyOn(element.isolateScope(), "submit");
            expect(submitButton[0].disabled).toBe(true);

            element.isolateScope().name = "foobar";
            element.isolateScope().selectedFilter = {label: "Last Modified:"};
            scope.$digest();

            expect(submitButton[0].disabled).toBe(false);
            submitButton.click();
            expect(submitSpy).toHaveBeenCalledWith("foobar");
        });

        xit("should properly submit", function(){
            // additional templates removed for John Wayne
            var submitButton = element.find("button.submit-button"),
            submitSpy = spyOn(element.isolateScope(), "submit").and.callThrough(),
            alertSpy = spyOn(window, "alert");
            element.isolateScope().selectedFilter = {label: "Last Modified:"};

            submitButton.click();
            expect(alertSpy).toHaveBeenCalledWith("Please enter a name to filter");

            element.isolateScope().name = "foobar";
            scope.$digest();
            submitButton.click();
            expect(alertSpy.calls.count()).toBe(1);
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
            expect(selectSpy).toHaveBeenCalledWith(CONFIG.view.ProjectManager.sortMenu.displayColumns[1]);
            expect(element.isolateScope().reverse).toEqual(true);
            expect(sortAndFilterSpy).toHaveBeenCalledWith("reverse", true, true);
            sortAndFilterSpy.calls.reset();
            selectButton.click();
            expect(element.isolateScope().selectedItem).toEqual(CONFIG.view.ProjectManager.sortMenu.displayColumns[1]);
            expect(sortAndFilterSpy).toHaveBeenCalledWith("reverse", false, true);
            expect(dropdownSpy).toHaveBeenCalledWith("column_2");
        });
    });

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
            expect(element.find("span").text()).toBe(' less than a minute ago');
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

    describe("Inline Rename", function(){
        var element,
        ViewService,
        scope;

        beforeEach(inject(function($rootScope, $compile, _ViewService_) {
            scope = $rootScope.$new();
            ViewService = _ViewService_;
            scope.item = {};
            scope.item.title = "the title";
            element = angular.element('<inline-rename template="inline_rename" item=item></inline-rename>');
            element = $compile(element)(scope);
            ViewService.setModel("ProjectsModel");
            scope.$digest();
        }));

        it('should correctly set the title', function() {
            var holder = element.find("h4.title");
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

        // modalInstance = {
        //     dismiss: jasmine.createSpy('modalInstance.dismiss'),
        // };