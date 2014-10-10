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
        getSpy = spyOn($http, "get").and.callThrough();
        putSpy = spyOn($http, "put").and.callThrough();
        deleteSpy = spyOn($http, "delete").and.callThrough();
        postSpy = spyOn($http, "post").and.callThrough();
        SERVER = _SERVER_;
        CONFIG = _CONFIG_;
        url = SERVER.server + CONFIG.application.api.projects;
        resource = new Resource(url);

        $httpBackend.expectGET(url).respond({
            "doesnot": "matter"
        });

    }));

    it('should be defined', function() {
        expect(Resource).toBeDefined();
    });

    it('should properly "GET"', function() {
        resource.get();
        expect(getSpy).toHaveBeenCalledWith(url,{method:"get", url: url});
    });

  
    it('should properly "POST"', function() {
        resource.create();
        expect(postSpy).not.toHaveBeenCalled();

        var obj = {
            name: 'title',
            description: "description",
            isMaster: false,
            parentId: ''
        };

        resource.create(obj);
        expect(postSpy).toHaveBeenCalledWith(url,obj, {method:'post', url:url, data:obj});
    });

    it('should "POST" with an id', function(){
        var scenarioUrl = SERVER.server + CONFIG.application.api.scenarios,
        resource = new Resource(scenarioUrl),
        obj = {
            name: 'title',
            description: "description",
            isMaster: false,
            parentId: ''
        },
        id = "12345";
        var url = scenarioUrl.replace(/:id/, id);
        resource.create(obj, {}, id);
        expect(postSpy).toHaveBeenCalledWith(url, obj, {method:'post', url:url, data:obj});
    });

    it('should properly "PUT"', function(){
         var obj = {params: {
                name: 'title',
                description: "description",
                isMaster: false,
                parentId: ''
            }
        };
        resource.put(obj);
        expect(putSpy).toHaveBeenCalledWith(url,obj, {method:'put', url:url, data:obj});
    });

});