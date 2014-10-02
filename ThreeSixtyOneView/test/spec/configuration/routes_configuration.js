/*global state, xit */

"use strict";

describe('Routes tests: ', function() {
    var location, $state, rootScope, urlProjects, urlFavorites, SERVER, CONFIG, $httpBackend, $urlRouter;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(module('stateMock'));

    beforeEach(inject(function($rootScope, $location, _$state_, _SERVER_, _CONFIG_, _$urlRouter_) {
        location = $location;
        rootScope = $rootScope;
        $urlRouter = _$urlRouter_;
        $state = _$state_;
        SERVER = _SERVER_;
        CONFIG = _CONFIG_;
        urlProjects = SERVER.server + CONFIG.application.api.projects;
        urlFavorites = SERVER.server + CONFIG.application.api.favorites;

    }));

    describe('Routes', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(urlProjects).respond({
                "doesnot": "matter"
            });
            $httpBackend.expectGET(urlFavorites).respond({
                "doesnot": "matter"
            });
        }));

        xit("should load index page", function() {
            $httpBackend.expectGET('views/display_manager.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/');
            rootScope.$digest();
            //console.info($urlRouter)
            // expect($state.current.controller).toBe('ManagerCtrl');
            // expect($state.current.viewName).toBe('ProjectManager');
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should load projects page", function() {
            var state = "ProjectManager";
            $state.expectTransitionTo(state);
            $state.go(state);
            expect($state.current.name).toBe(state);
            $state.ensureAllTransitionsHappened();
        });

        xit("should load index page on unknown route", function() {
            $httpBackend.expectGET('views/display_manager.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/nowheresville');
            rootScope.$digest();
            expect(state.current.controller).toBe('ManagerCtrl');
            expect(state.current.viewName).toBe('ProjectManager');
            $httpBackend.verifyNoOutstandingExpectation();
        });

        xit("should load scenario edit page", function() {
            $httpBackend.expectGET('views/scenario_edit.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/scenarioEdit/project/scenario');
            rootScope.$digest();
            expect(state.current.controller).toBe('ScenarioEditCtrl');
            expect(state.current.viewName).not.toBeDefined();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        xit ("should load the scenario create page", function(){
             $httpBackend.expectGET('views/scenario_create.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/scenarioCreate/projectName');
            rootScope.$digest();
            expect(state.current.controller).toBe('ScenarioCreateCtrl');
            expect(state.current.viewName).not.toBeDefined();
            $httpBackend.verifyNoOutstandingExpectation();
        });
    });
});