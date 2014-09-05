'use strict';

describe('Service: ProjectModel', function() {
	var scope, ProjectsModel, resource, resourceSpy, rootScope, $httpBackend, url;

    // load the service's module
    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($httpBackend, $rootScope, _ProjectsModel_, Resource, SERVER, CONFIG) {
    	url = SERVER.remote + CONFIG.application.api.projects;
        ProjectsModel = _ProjectsModel_;
        resource = new Resource(url)
        resourceSpy = spyOn(resource, "get").and.returnValue({foo:"bar"})
        rootScope = $rootScope;

        $httpBackend.whenGET(url).respond({
            "doesnot": "matter"
        });
    }));

    it("should exist and define an API", function(){
    	expect(ProjectsModel).toBeDefined();
        expect(ProjectsModel.find).toBeDefined();
        expect(ProjectsModel.get).toBeDefined();
        expect(ProjectsModel.create).toBeDefined();
    });

    xit("should find all data", function(){
        // ProjectsModel.find();
        // rootScope.$apply();
        console.info(ProjectsModel.$futureData)
        expect(resourceSpy).toHaveBeenCalled();
    })
});