describe('Controllers: ', function() {
    var scope, ctrl, modalInstance, ProjectsModel;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modalInstance = {
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
        };
        ProjectsModel = {
            create: jasmine.createSpy('ProjectsModel.create'),
        }
        ctrl = $controller('ProjectCreateCtrl', {
            $scope: scope,
            $modalInstance: modalInstance,
            ProjectsModel: ProjectsModel
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

    it("should call the Projects Model with the name of the new project", function() {
        scope.create("xyz");
        expect(ProjectsModel.create).toHaveBeenCalledWith({
            name: 'xyz',
            description: "this is a test",
            isMaster: false,
            parentId: ''
        });
    });
});