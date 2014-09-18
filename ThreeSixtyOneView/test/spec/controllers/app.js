describe('Routes tests: ', function() {
    var location, route, rootscope, urlProjects, urlFavorites, SERVER, CONFIG;

    beforeEach(module('ThreeSixtyOneView'));

    beforeEach(inject(function($rootScope, $location, $route, _SERVER_, _CONFIG_) {
        location = $location;
        rootScope = $rootScope;
        route = $route;
        SERVER = _SERVER_;
        CONFIG = _CONFIG_;
        urlProjects = SERVER.remote + CONFIG.application.api.projects;
        urlFavorites = SERVER.remote + CONFIG.application.api.favorites;

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

        it("should load index page", function() {
            $httpBackend.expectGET('views/display_manager.tpl.html').respond({
                "doesnot": "matter"
            })
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('ManagerCtrl');
            expect(route.current.viewName).toBe('ProjectManager');
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should load projects page", function() {
            $httpBackend.expectGET('views/display_manager.tpl.html').respond({
                "doesnot": "matter"
            })
            location.path('/projects');
            rootScope.$digest();
            expect(route.current.controller).toBe('ManagerCtrl');
            expect(route.current.viewName).toBe('ProjectManager');
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should load index page on unknown route", function() {
            $httpBackend.expectGET('views/display_manager.tpl.html').respond({
                "doesnot": "matter"
            })
            location.path('/nowheresville');
            rootScope.$digest();
            expect(route.current.controller).toBe('ManagerCtrl');
            expect(route.current.viewName).toBe('ProjectManager');
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it("should load scenario edit page", function() {
            $httpBackend.expectGET('views/scenario_edit.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/scenarioEdit/project/scenario');
            rootScope.$digest();
            expect(route.current.controller).toBe('ScenarioEditCtrl');
            expect(route.current.viewName).not.toBeDefined();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it ("should load the scenario create page", function(){
             $httpBackend.expectGET('views/scenario_create.tpl.html').respond({
                "doesnot": "matter"
            });
            location.path('/scenarioCreate/projectName');
            rootScope.$digest();
            expect(route.current.controller).toBe('ScenarioCreateCtrl');
            expect(route.current.viewName).not.toBeDefined();
            $httpBackend.verifyNoOutstandingExpectation();
        })
    });
});