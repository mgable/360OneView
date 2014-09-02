'use strict';

describe('Service: ProjectModel', function() {
	var scope, ProjectsModel, Projects, Resource;

    // load the service's module
    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function(_ProjectsModel_, _Resource_) {
    	ProjectsModel = _ProjectsModel_;
        Resource = _Resource_;
    }));

    it("should exist and define and API", function(){
    	expect(ProjectsModel).toBeDefined();
        expect(ProjectsModel.find).toBeDefined();
        expect(ProjectsModel.get).toBeDefined();
        expect(ProjectsModel.create).toBeDefined();
    });

    it("should create a new project", function(){
        console.info(Resource)
        var spy = spyOn(Resource.prototype, "create");
        expect(spy).toHaveBeenCalled();
    })
});