'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services','ngRoute', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button;

    describe("Display Actions:", function() {

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
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
            expect(spy).toHaveBeenCalledWith('project')
        });
    });

    describe("MS Dropdown:", function(){
        var scope, element, CONFIG, $httpBackend, ViewService, ViewServiceSpy;
        beforeEach(inject(function($rootScope, $compile, CONFIG, ViewService){   
            scope = $rootScope.$new();
            CONFIG = CONFIG;
            element = angular.element('<ms-dropdown selected-sort-index="1" reverse=false msid="column_2"></ms-dropdown>');
            element = $compile(element)(scope);
            ViewServiceSpy = spyOn(ViewService, "getCurrentView").and.returnValue("ProjectManager")
            scope.$digest();
        }));

        it("should compile", function(){
            //console.info(element)
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
            }
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
            element = angular.element('<inline-rename item=item></inline-rename>');
            element = $compile(element)(scope);
            ViewService.setModel("ProjectsModel")
            scope.$digest();
        }));

        it('should correctly set the title', function() {
            var holder = element.find("h4.title")
            expect(holder.text()).toBe(scope.item.title);
            holder = element.find("input");
            expect(holder.val()).toEqual(scope.item.title)
        });


        it('should hide the input field on start', function() {
            var holder = element.find("h4")
            expect($(holder[0]).hasClass('ng-hide')).toEqual(false);
            expect($(holder[1]).hasClass('ng-hide')).toEqual(true);
        });

        it("should fire the action when clicked", function(){
            var holder = element.find(".edit");
            expect(element.isolateScope().isActive).toBe(false);
            holder.click();
            expect(element.isolateScope().isActive).toBe(true);
        })

        it("should fire cancel when clicked", function(){
            var cancelButton = element.find("h4:eq(1) a:eq(1)");
            expect(element.isolateScope().isActive).toBe(false);
            cancelButton.click();
            expect(element.isolateScope().isActive).toBe(false);
        })
    })
});

        // modalInstance = {
        //     dismiss: jasmine.createSpy('modalInstance.dismiss'),
        // };