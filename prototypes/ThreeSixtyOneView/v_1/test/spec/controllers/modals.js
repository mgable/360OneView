describe('Controllers: ', function() {
    var scope, ctrl, modalInstance;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
        }
        ctrl = $controller('ProjectCreateCtrl', {
            $scope: scope,
            $modalInstance: modalInstance
        })
    }));

    it("should close the dialog box when close is clicked", function() {
        scope.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it("should close the dialog box when create has been clicked", function() {
        scope.create();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('create');
    });
});