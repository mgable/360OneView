/*global state, xit */

"use strict";

describe('Routes tests: ', function() {
    var $rootScope, $state, $httpBackend, urlProjects, urlFavorites, SERVER, CONFIG;

    beforeEach(module('ThreeSixtyOneView'), function($provide){
        $provide.value("ProjectsModel", projects = {}); //This does not work
        projects.get = jasmine.createSpy('get').and.returnValue('settings-all');
    });

    beforeEach(inject(function(_$state_, _$rootScope_, _$httpBackend_, SERVER, CONFIG, ProjectsModel) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        urlProjects = SERVER.server + CONFIG.application.api.projects;
        urlFavorites = SERVER.server + CONFIG.application.api.favorites;
        // $httpBackend.whenGET(urlProjects).respond('');
        // $httpBackend.whenGET(urlFavorites).respond('');
        // $httpBackend.whenGET('views/display_manager.tpl.html').respond('');
    }));

    describe('Routes', function() {
  
        it("should have a projects state", inject(function($injector) {
            var state = "ProjectManager", 
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/projects");
            expect(config.controller).toBe("ManagerCtrl");
            //$state.go(state);
            //$rootScope.$digest();
            //expect($state.current.name).toBe(state);
            //expect($injector.invoke(config.resolve.Projects)).toEqual("")
        }));

        it("should have a scenario edit state", function() {
            var state = "ScenarioEdit", 
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/scenarioEdit/:project/:scenario");
            expect(config.controller).toBe("ScenarioEditCtrl");
        });

        it ("should have a scenario create state", function(){
            var state = "ScenarioCreate", 
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/scenarioCreate/:projectName");
            expect(config.controller).toBe("ScenarioCreateCtrl");
        });

        it ("should have a dashboard state", function(){
            var state = "Dashboard", 
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/dashboard/:projectName");
            expect(config.controller).toBe("ManagerCtrl");
        });
    });
});