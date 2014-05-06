'use strict';

describe('Service: Resource', function() {

    // load the service's module
    beforeEach(module('test1App'));

    // instantiate service
    var Resource, Data, Fetch;
    beforeEach(inject(function(_Resource_, _Data_, _Fetch_) {
        Resource = _Resource_;
        Data = _Data_;
        Fetch = _Fetch_;
    }));

    it('should do something', function() {

    });

});