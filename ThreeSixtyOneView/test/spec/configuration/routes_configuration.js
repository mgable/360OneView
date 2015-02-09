"use strict";

describe('Routes tests: ', function() {
    var $rootScope, $state, $httpBackend, urlProjects, urlFavorites;

    beforeEach(module('ThreeSixtyOneView.config'));

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
        });

        it("should have a scenario state", function() {
            var state = "Scenario",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.url).toBe("/scenario/:projectId/:scenarioId");
            expect(config.controller).toBe("ScenarioCtrl");
            expect(config.templateUrl).toBe("views/scenarios.tpl.html");
        });

        it("should have a scenario edit state", function() {
            var state = "Scenario.edit",
            config = $state.get(state);
            expect(config.name).toBe(state);
        });

        it("should have a scenario results state", function() {
            var state = "Scenario.results",
            config = $state.get(state);
            expect(config.name).toBe(state);
            expect(config.views).toMatch({'results': {'templateUrl': "views/includes/scenario_results.tpl.html"}});
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
            expect(config.controller).toBe("ScenarioListingCtrl");
        });
    });
});