'use strict';

describe('Service: Resource', function() {

    // load the service's module
    beforeEach(module('ThreeSixtyOneView'));

    // instantiate service
    var Resource, $http, getSpy, putSpy, deleteSpy, postSpy, resource, $rootScope, $httpBackend, SERVER, CONFIG, url;
    beforeEach(inject(function(_Resource_, _$http_, _$rootScope_, _$httpBackend_, _SERVER_, _CONFIG_) {
        Resource = _Resource_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        getSpy = spyOn($http, "get").andCallThrough();
        putSpy = spyOn($http, "put").andCallThrough();
        deleteSpy = spyOn($http, "delete").andCallThrough();
        postSpy = spyOn($http, "post").andCallThrough();
        SERVER = _SERVER_;
        CONFIG = _CONFIG_;
        url = SERVER.remote + CONFIG.application.api.projects

        resource = new Resource(url);

        $httpBackend.expectGET(url).respond({
            "doesnot": "matter"
        });

    }));

    it('should be defined', function() {
        expect(Resource).toBeDefined();
        expect(resource).toBeDefined();
    });

    it('should properly "GET"', function() {
        var promise = resource.get();
        expect(getSpy).toHaveBeenCalledWith(url,{method:"get", url: url});
    });

    xit('should properly "Query"', function(done) {
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

    xit('should properly "set"', function() {
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

    xit('should properly "remove"', function() {
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

    xit('should properly "clone"', function() {
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

        var obj = {
            name: 'title',
            description: "description",
            isMaster: false,
            parentId: ''
        }

        result = resource.create(obj);
        expect(postSpy).toHaveBeenCalledWith(url,obj, undefined);
    });

    it('should properly make a path', function() {
        var result = resource.path();
        expect(result).toBe(url)
    });
});