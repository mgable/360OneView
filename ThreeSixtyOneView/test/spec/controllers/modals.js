/* global xit */
"use strict";

describe('Controllers: Modals: ', function() {
    var scope, ctrl, modalInstance, eventSpy, EVENTS, CONFIG, projectSpy, data, event;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, _EVENTS_, $q) {
        var deferred = $q.defer(), data = {"id": "1"};
        deferred.resolve(data);
        scope = $rootScope.$new();
        modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };
        eventSpy = spyOn($rootScope, "$broadcast");
        EVENTS = _EVENTS_;
    }));

    describe('ProjectCreateCtrl: ', function() {
        beforeEach(inject(function($rootScope, $controller, _CONFIG_) {
            CONFIG = _CONFIG_;
            ctrl = $controller('ProjectCreateCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                modalProperties: modalInstance,
                data: {}
            });

        }));

        it ("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.submit).toBeDefined();
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
            scope.submit('create');
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
        });

        it("should call the Projects Model with the name of the new project", function() {
            scope.submit("xyz");
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
            expect(eventSpy).toHaveBeenCalledWith(EVENTS.createProject, 'xyz');
        });
    });


    describe('ScenarioCopyCtrl: ', function(){
         beforeEach(inject(function($rootScope, $controller, _CONFIG_) {
            CONFIG = _CONFIG_;
            ctrl = $controller('ScenarioCopyCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                data: {"foo": "bar"}
            });
        }));

        it ("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.submit).toBeDefined();
        });

        it("should extend ModalBaseCtrl", function(){
            expect(scope.close).toBeDefined();
            expect(scope.inputRestrictions).toBe(CONFIG.application.inputRestrictions);
        });

        it("should close the dialog box when close is clicked", function() {
            scope.close();
            expect(modalInstance.dismiss).toHaveBeenCalled();
        });

        it("should call the Scenario Model with the name of the new scenario", function() {
            scope.submit("xyz");
            expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
            expect(eventSpy).toHaveBeenCalledWith(EVENTS.copyScenario, {foo: "bar", name: "xyz"});
        });
    });
});