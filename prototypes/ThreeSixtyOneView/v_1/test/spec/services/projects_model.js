'use strict';

describe('Service: ProjectModel', function() {
<<<<<<< HEAD
	var scope, ProjectsModel, Projects, Resource;
=======
	var scope, ProjectsModel, Projects;
>>>>>>> 76988105a83c4e99373a4da89ced65f0ae05b712

    // load the service's module
    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView'));

<<<<<<< HEAD
    beforeEach(inject(function(_ProjectsModel_, _Resource_) {
    	ProjectsModel = _ProjectsModel_;
        Resource = _Resource_;
=======
    beforeEach(inject(function(_ProjectsModel_) {
    	ProjectsModel = _ProjectsModel_;
>>>>>>> 76988105a83c4e99373a4da89ced65f0ae05b712
    }));

    it("should exist and define and API", function(){
    	expect(ProjectsModel).toBeDefined();
        expect(ProjectsModel.find).toBeDefined();
        expect(ProjectsModel.get).toBeDefined();
        expect(ProjectsModel.create).toBeDefined();
    });
<<<<<<< HEAD

    it("should create a new project", function(){
        console.info(Resource)
        var spy = spyOn(Resource.prototype, "create");
        expect(spy).toHaveBeenCalled();
    })
=======
>>>>>>> 76988105a83c4e99373a4da89ced65f0ae05b712
});