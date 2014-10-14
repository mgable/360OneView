"use strict";

describe('Routes tests: ', function() {
    var $rootScope, $state, $httpBackend, urlProjects, urlFavorites, projects;

    beforeEach(module('ThreeSixtyOneView'), function($provide){
        $provide.value("ProjectsModel", projects = {}); //This does not work
        projects.get = jasmine.createSpy('get').and.returnValue('settings-all');
    });

    beforeEach(inject(function(_$state_, _$rootScope_, _$httpBackend_, SERVER, CONFIG) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        urlProjects = SERVER.server + CONFIG.application.api.projects;
        urlFavorites = SERVER.server + CONFIG.application.api.favorites;
    }));

    describe('Routes', function() {
  
        it("should have a projects state", function() {
            var state = "ProjectManager",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/projects");
            expect(config.controller).toBe("ProjectListingCtrl");
            //$state.go(state);
            //$rootScope.$digest();
            //expect($state.current.name).toBe(state);
            //expect($injector.invoke(config.resolve.Projects)).toEqual("")
        });

        it("should have a scenario edit state", function() {
            var state = "ScenarioEdit",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/scenarioEdit/:projectId/:scenarioId");
            expect(config.controller).toBe("ScenarioEditCtrl");
        });

        it ("should have a scenario create state", function(){
            var state = "ScenarioCreate",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/scenarioCreate/:projectId");
            expect(config.controller).toBe("ScenarioCreateCtrl");
        });

        it ("should have a dashboard state", function(){
            var state = "Dashboard",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/dashboard/:projectId");
            expect(config.controller).toBe("ProjectDashboardCtrl");
        });
    });
});