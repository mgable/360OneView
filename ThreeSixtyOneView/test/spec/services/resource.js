'use strict';

describe('Service: Resource', function() {

    // load the service's module
    beforeEach(module('ThreeSixtyOneView'));

    // instantiate service
    var Resource, $http, resource, $rootScope, $httpBackend, SERVER, CONFIG, url;
    beforeEach(inject(function(_Resource_, _$http_, _$rootScope_, _$httpBackend_, _SERVER_, _CONFIG_) {
        Resource = _Resource_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        SERVER = _SERVER_;
        CONFIG = _CONFIG_;
        url = SERVER.server + CONFIG.application.api.projects;
        resource = new Resource(url);

        $httpBackend.when('GET', url).respond({"doesnot": "matter"});
        $httpBackend.when('POST', url).respond({"doesnot": "matter"});
        $httpBackend.when('POST', SERVER.server + CONFIG.application.api.scenarios.replace(/:id/, 12345)).respond({"doesnot": "matter"});
        $httpBackend.when('PUT', url).respond({"doesnot": "matter"});
        $httpBackend.when('DELETE', url + '?id=12345').respond({"doesnot": "matter"});
    }));

    it('should be defined', function() {
        expect(Resource).toBeDefined();
    });

    it('should properly "GET"', function() {
        resource.get();
        $httpBackend.flush();
    });

  
    it('should properly "POST"', function() {
        resource.create();

        var obj = {
            name: 'title',
            description: "description",
            isMaster: false,
            parentId: ''
        };
        resource.create(obj);
        $httpBackend.flush();
    });

    it('should "POST" with an id', function() {
        var scenarioUrl = SERVER.server + CONFIG.application.api.scenarios,
        resource = new Resource(scenarioUrl),
        obj = {
            name: 'title',
            description: "description",
            isMaster: false,
            parentId: ''
        },
        id = {"id": "12345"};
        var url = scenarioUrl.replace(/:id/, id.id);
        resource.create(obj, {}, id);
        $httpBackend.flush();
    });

    it('should properly "PUT"', function() {
        var obj = {params: {
                name: 'title',
                description: "description",
                isMaster: false,
                parentId: ''
            }
        };
        resource.put(obj);
        $httpBackend.flush();
    });

    it('should properly "DELETE"', function() {
        var obj = {params: {
                id: 12345
            }
        };
        resource.delete(obj);
        $httpBackend.flush();
    });

});