"use strict";

describe('Controllers: Modals: ', function() {
    var scope, ctrl, modalInstance, eventSpy;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
        };
        eventSpy = spyOn(scope, "$emit");
    }));

    describe('ProjectCreateCtrl: ', function() {
        beforeEach(inject(function($rootScope, $controller) {
            ctrl = $controller('ProjectCreateCtrl', {
                $scope: scope,
                $modalInstance: modalInstance
            });

        }));

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
            expect(eventSpy).toHaveBeenCalledWith("project:create", {
                title: 'xyz',
                description: "",
                isMaster: false
            });
        });
    });
});