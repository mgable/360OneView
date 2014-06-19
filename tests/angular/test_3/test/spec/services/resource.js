'use strict';

describe('Service: Resource', function() {

    // load the service's module
    beforeEach(module('fileManagerApp'));

    // instantiate service
    var Resource, $http, getSpy, putSpy, deleteSpy, postSpy, resource, $rootScope, $httpBackend;
    beforeEach(inject(function(_Resource_, _$http_, _$rootScope_, _$httpBackend_) {
        Resource = _Resource_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        getSpy = spyOn($http, "get").andCallThrough();
        putSpy = spyOn($http, "put").andCallThrough();
        deleteSpy = spyOn($http, "delete").andCallThrough();
        postSpy = spyOn($http, "post").andCallThrough();
        resource = new Resource("http://127.0.0.1:3001/api/item");

        $httpBackend.expectGET('http://127.0.0.1:3001/api/item').respond({
            "doesnot": "matter"
        });
        $httpBackend.expectGET('http://127.0.0.1:3001/api/item/0/1').respond({
            "doesnot": "matter"
        });
    }));

    it('should be defined', function() {
        expect(Resource).toBeDefined();
        expect(resource).toBeDefined();
    });

    it('should properly "GET"', function() {
        var promise = resource.get();
        expect(getSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item');

        promise = resource.get('1234');
        expect(getSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item/1234');
    });

    it('should properly "Query"', function(done) {
        var result = resource.query();
        //expect(resource.query).not.toThrow(new Error("I need a start and end"));
        expect(result.source.exception).toBe("I need a start and end");
        expect(getSpy).not.toHaveBeenCalled();

        result = resource.query(1);
        expect(result.source.exception).toBe("I need a start and end");
        expect(getSpy).not.toHaveBeenCalled();

        result = resource.query(0, 1);
        expect(getSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item/0/1');
        //TODO: determine result
    });

    it('should properly "set"', function() {
        var result = resource.set();
        expect(result.source.exception).toBe('I need an item with an id');
        expect(putSpy).not.toHaveBeenCalled();

        result = resource.set({
            id: '1234'
        });
        expect(putSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item/1234', {
            id: '1234'
        });

        //TODO: determine result
    });

    it('should properly "remove"', function() {
        var result = resource.remove();
        expect(result.source.exception).toBe('I need an array with a list of ids');
        expect(deleteSpy).not.toHaveBeenCalled();

        result = resource.remove(['1234']);
        expect(deleteSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item', {
            params: {
                ids: ['1234']
            },
            method: 'delete',
            url: 'http://127.0.0.1:3001/api/item'
        });
        //TODO: determine result
    });

    it('should properly "clone"', function() {
        var result = resource.clone();
        expect(result.source.exception).toBe('I need an id');
        expect(postSpy).not.toHaveBeenCalled();

        result = resource.clone('1234');
        expect(postSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item/1234', {
            params: {
                id: '1234'
            }
        });
        //TODO: determine result
    });

    it('should properly "create"', function() {
        var result = resource.create();
        expect(result.source.exception).toBe('I need an item template');
        expect(postSpy).not.toHaveBeenCalled();

        result = resource.create('1234');
        expect(postSpy).toHaveBeenCalledWith('http://127.0.0.1:3001/api/item', {
            params: {
                data: '1234'
            }
        });
        //TODO: determine result
    });

    it('should properly make a path', function() {
        var result = resource.path();
        expect(result).toBe('http://127.0.0.1:3001/api/item')

        result = resource.path('1234');
        expect(result).toBe('http://127.0.0.1:3001/api/item/1234')
    });
});