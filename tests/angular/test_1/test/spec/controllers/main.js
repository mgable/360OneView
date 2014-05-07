'use strict';
describe('Controller: LogInViewCtrl', function() {
    // load the controller's module
    beforeEach(module('test1App'));

    var dialogs,
        scope,
        dialogSpy,
        q,
        location,
        LogInViewCtrl;

    beforeEach(inject(function($controller, $rootScope, $location, dialogs, $q) {
        q = $q.defer();

        dialogSpy = spyOn(dialogs, "create").andReturn({
            result: q.promise
        });

        scope = $rootScope.$new();
        location = $location;

        LogInViewCtrl = $controller('LogInViewCtrl', {
            $scope: scope,
            $location: location,
        });



    }));

    it('should create a dialog instance', function() {
        q.resolve(true);
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should redirect to /dashboard', function() {
        q.resolve(true);
        scope.$apply();
        expect(location.path()).toBe('/dashboard');
    });
});

describe('Controller: LogInDialogCtrl', function() {

    // load the controller's module
    beforeEach(module('test1App'));

    var LogInDialogCtrl,
        modalInstance,
        q,
        permissionSpy,
        somethingSpy,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $q, Permissionsmanager) {

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
        };

        scope = $rootScope.$new();

        q = $q.defer();
        permissionSpy = spyOn(Permissionsmanager, "login").andReturn(q.promise);

        LogInDialogCtrl = $controller('LogInDialogCtrl', {
            $scope: scope,
            $modalInstance: modalInstance
        });

    }));

    it('should check permissions of username and password', function() {
        scope.user = {
            username: 'foo',
            password: 'bar'
        }

        q.resolve(true);
        scope.save();
        expect(permissionSpy).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should save on valid username / password', inject(function($q, Permissionsmanager) {
        //somethingSpy = spyOn(scope, "something").andCallThrough();
        q.resolve(true);

        scope.save();
        scope.$apply();

        //expect(somethingSpy).toHaveBeenCalled();
        expect(modalInstance.close).toHaveBeenCalledWith(scope.user);
    }));

    it('should fail on invalid username / password', inject(function($q, Permissionsmanager) {
        //somethingSpy = spyOn(scope, "something").andCallThrough();
        q.resolve(false);

        scope.save();
        scope.$apply();

        //expect(somethingSpy).toHaveBeenCalled();
        expect(scope.user.errorMsg).toBe('Username or password is incorrect.');
    }));


    describe("enter key functions", function() {
        var saveSpy, evt;
        beforeEach(function() {
            saveSpy = spyOn(scope, "save");
            evt = {
                keyCode: 13
            };
            scope.user = {
                username: 'foo',
                password: 'bar'
            }
        })

        it('should submit the form when the enter key is pressed', function() {
            scope.hitEnter(evt);
            expect(saveSpy).toHaveBeenCalled();
        });

        it('should not submit the form when any key but the enter key is pressed', function() {

            var evt = {
                keyCode: 11
            };

            scope.hitEnter(evt);
            expect(saveSpy).not.toHaveBeenCalled();
        });

        it('should not submit the form when no username is supplied', function() {
            scope.user = {
                username: '',
                password: 'bar'
            }

            scope.hitEnter(evt);
            expect(saveSpy).not.toHaveBeenCalled();
        });

    })
});