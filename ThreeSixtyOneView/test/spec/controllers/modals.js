/* global xit */
"use strict";

xdescribe('Controllers: Modals: ', function() {
    var scope, ctrl, modalInstance, eventSpy, EVENTS, ProjectsService, CONFIG, projectSpy, data, event;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, _EVENTS_, _ProjectsService_, $q) {
        var deferred = $q.defer(), data = {"id": "1"};
        deferred.resolve(data);
        scope = $rootScope.$new();
        modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };
        ProjectsService = _ProjectsService_;
        projectSpy = spyOn(ProjectsService, "create").and.returnValue(deferred.promise);
        eventSpy = spyOn($rootScope, "$broadcast");
        EVENTS = _EVENTS_;
    }));

    describe('ProjectCreateCtrl: ', function() {
        beforeEach(inject(function($rootScope, $controller, _CONFIG_) {
            CONFIG = _CONFIG_;
            ctrl = $controller('ProjectCreateCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                ProjectsService: ProjectsService
            });

        }));

        it ("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.create).toBeDefined();
        });

        it("should extend ModalBaseCtrl", function(){
            expect(scope.close).toBeDefined();
            expect(scope.inputRestrictions).toBe(CONFIG.application.inputRestrictions);
        });

        it("should close the dialog box when close is clicked", function() {
            scope.close();
            expect(modalInstance.dismiss).toHaveBeenCalled();
        });

        it("should close the dialog box when create has been clicked", function() {
            scope.create();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
        });

        it("should call the Projects Model with the name of the new project", function() {
            scope.create("xyz");
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
            expect(projectSpy).toHaveBeenCalledWith({title: 'xyz', description: "", isMaster: false});
        });
    });

    describe('ProjectRenameCtrl: ', function(){
        beforeEach(inject(function($rootScope, $controller, _CONFIG_) {
            CONFIG = _CONFIG_;
            data = {"title": "title"};
            event = {
                preventDefault: jasmine.createSpy('event.stopPropagation'),
            };
            spyOn(scope, "$emit");
            ctrl = $controller('ProjectRenameCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                data: data
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should bootstrap all data", function(){
            expect(scope.data).toBe(data);
            expect(scope.name).toBe("title");
        });

        it("should extend ModalBaseCtrl", function(){
            expect(scope.close).toBeDefined();
            expect(scope.inputRestrictions).toBe(CONFIG.application.inputRestrictions);
        });

        it ("should define an API", function(){
            expect(scope.rename).toBeDefined();
        });

        it ("should rename a project", function(){
            scope.rename("new title", event);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(scope.data.title).toBe("new title");
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
            expect(scope.$emit).toHaveBeenCalledWith(EVENTS.renameProject, scope.data);
        });
    });
});