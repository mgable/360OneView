'use strict';

describe('Service: ProjectModel', function() {
	var scope, ProjectsModel, Projects;

    // load the service's module
    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function(_ProjectsModel_) {
    	ProjectsModel = _ProjectsModel_;
    }));

    it("should exist and define and API", function(){
    	expect(ProjectsModel).toBeDefined();
        expect(ProjectsModel.find).toBeDefined();
        expect(ProjectsModel.get).toBeDefined();
        expect(ProjectsModel.create).toBeDefined();
    });
});