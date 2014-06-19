'use strict';

describe('Service: Modal', function() {

    // load the service's module
    beforeEach(module('fileManagerApp'));

    // instantiate service
    var Modal, $rootScope;
    beforeEach(inject(function(_Modal_, _$rootScope_) {
        Modal = _Modal_;
        $rootScope = _$rootScope_;
        spyOn($rootScope, '$broadcast');
    }));

    it('should be defined', function() {
        expect(Modal).toBeDefined();
    });

    it('should correctly set status on true', function() {
        Modal.setStatus(true, [{
            id: "12345"
        }]);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('modal', '12345');
    });

    it('should correctly set status on false', function() {
        Modal.setStatus(false, [{
            id: "12345"
        }]);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('modal', false);
    });
});