'use strict';

describe('Service: Permissionsmanager', function() {

    // load the service's module
    beforeEach(module('test1App'));

    // instantiate service
    var Permissionsmanager;
    beforeEach(inject(function(_Permissionsmanager_) {
        Permissionsmanager = _Permissionsmanager_;
    }));

    it('should initaliZe all varibales', function() {
        expect(Permissionsmanager.password).toBe('');
        expect(Permissionsmanager.username).toBe('');
        expect(Permissionsmanager.errorMsg).toEqual('Username or password is incorrect.');
    });

    it('should have a login function', function() {
        expect(Permissionsmanager.login).toBeDefined();
    });

    it('should be able to process the results', function() {
        expect(Permissionsmanager.processResults).toBeDefined();
        var permissionsmanagerSpy = spyOn(Permissionsmanager, 'processResults').andCallThrough(),
            setUsernameSpy = spyOn(Permissionsmanager, 'setUsername'),
            setPasswordSpy = spyOn(Permissionsmanager, 'setPassword'),
            setLoginSpy = spyOn(Permissionsmanager, 'setLogin'),
            obj = {
                'status': 'ok',
                'username': 'fred',
                'password': 'wilma'
            };
        Permissionsmanager.processResults(obj);
        expect(permissionsmanagerSpy).toHaveBeenCalledWith(obj);
        expect(setUsernameSpy).toHaveBeenCalledWith(obj.username);
        expect(setPasswordSpy).toHaveBeenCalledWith(obj.password);
        expect(setLoginSpy).toHaveBeenCalledWith(true);
    });

});