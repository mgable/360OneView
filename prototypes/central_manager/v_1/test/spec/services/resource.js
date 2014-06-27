'use strict';

describe('Service: Resource', function() {

    // load the service's module
    beforeEach(module('centralManagerApp'));

    // instantiate service
    var Resource, $http, getSpy, putSpy, deleteSpy, postSpy, resource, $rootScope, $httpBackend, SERVER, CENTRAL_MANAGER_REST_API;
    beforeEach(inject(function(_Resource_, _$http_, _$rootScope_, _$httpBackend_, _SERVER_, _CENTRAL_MANAGER_REST_API_) {
        Resource = _Resource_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        getSpy = spyOn($http, "get").andCallThrough();
        putSpy = spyOn($http, "put").andCallThrough();
        deleteSpy = spyOn($http, "delete").andCallThrough();
        postSpy = spyOn($http, "post").andCallThrough();
        CENTRAL_MANAGER_REST_API = _CENTRAL_MANAGER_REST_API_;
        SERVER = _SERVER_;
        resource = new Resource(SERVER + CENTRAL_MANAGER_REST_API);

        $httpBackend.expectGET(SERVER + CENTRAL_MANAGER_REST_API).respond({
            "doesnot": "matter"
        });
        $httpBackend.expectGET(SERVER + CENTRAL_MANAGER_REST_API + '/0/1').respond({
            "doesnot": "matter"
        });
    }));

    it('should be defined', function() {
        expect(Resource).toBeDefined();
        expect(resource).toBeDefined();
    });

    it('should properly "GET"', function() {
        var promise = resource.get();
        expect(getSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API);

        promise = resource.get('1234');
        expect(getSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API + '/1234');
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
        expect(getSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API + '/0/1');
        //TODO: determine result
    });

    it('should properly "set"', function() {
        var result = resource.set();
        expect(result.source.exception).toBe('I need an item with an id');
        expect(putSpy).not.toHaveBeenCalled();

        result = resource.set({
            id: '1234'
        });
        expect(putSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API + '/1234', {
            id: '1234'
        });

        //TODO: determine result
    });

    it('should properly "remove"', function() {
        var result = resource.remove();
        expect(result.source.exception).toBe('I need an array with a list of ids');
        expect(deleteSpy).not.toHaveBeenCalled();

        result = resource.remove(['1234']);
        expect(deleteSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API, {
            params: {
                ids: ['1234']
            },
            method: 'delete',
            url: SERVER + CENTRAL_MANAGER_REST_API
        });
        //TODO: determine result
    });

    it('should properly "clone"', function() {
        var result = resource.clone();
        expect(result.source.exception).toBe('I need an id');
        expect(postSpy).not.toHaveBeenCalled();

        result = resource.clone('1234');
        expect(postSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API + '/1234', {
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

        result = resource.create({
            title: "title",
            description: "description"
        });
        expect(postSpy).toHaveBeenCalledWith(SERVER + CENTRAL_MANAGER_REST_API, {
            params: {
                title: 'title',
                description: "description"
            }
        });
        //TODO: determine result
    });

    it('should properly make a path', function() {
        var result = resource.path();
        expect(result).toBe(SERVER + CENTRAL_MANAGER_REST_API)

        result = resource.path('1234');
        expect(result).toBe(SERVER + CENTRAL_MANAGER_REST_API + '/1234')
    });
});