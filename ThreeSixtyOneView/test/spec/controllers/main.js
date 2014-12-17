/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: ', function() {
    var Projects, EVENTS, rootScope, data, scope, ctrl, spy, $state, SortAndFilterService, DiaglogService, FavoritesService, CONFIG, $rootScope, onSpy, $provide, event, GotoService, deferred, $httpBackend, filterSpy, isFavoriteSpy, ErrorService, ScenarioService;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    beforeEach(inject(function($httpBackend){
        $httpBackend.expectPOST("http://ec2-54-205-7-240.compute-1.amazonaws.com:8080/rubix/v1/favorite/project").respond({});
        $httpBackend.expectGET("http://ec2-54-205-7-240.compute-1.amazonaws.com:8080/rubix/v1/project").respond({});
        $httpBackend.expectGET("http://ec2-54-205-7-240.compute-1.amazonaws.com:8080/rubix/v1/favorite/project").respond({});
        $httpBackend.expectGET("views/projects.tpl.html").respond({});
    }))

    describe("Main CTRL: ", function(){
        beforeEach(inject(function($rootScope, $controller, _ErrorService_) {
            scope = $rootScope.$new();
            ErrorService = _ErrorService_;
            ctrl = $controller('MainCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should import Error Service", function(){
            expect(scope.ErrorService).toBe(ErrorService);
        });
    });

    describe("Navigation CTRL:", function(){
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('NavigationCtrl', {
                $scope: scope,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });
    });

    describe("Project Listing CTRL", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_, _FavoritesService_, _SortAndFilterService_, _EVENTS_, _ScenarioService_, $q ) {
            data = [{id:"123", title:"title", isMaster:false},{id:"234", title:"title", isMaster:false},{id:"456", title:"title master", isMaster:true}];
            $rootScope = _$rootScope_;
            EVENTS = _EVENTS_;
            FavoritesService = _FavoritesService_;
            ScenarioService = _ScenarioService_;
            SortAndFilterService = _SortAndFilterService_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            $state = _$state_;
            $state.current.name = "ProjectManager";
            event = {
              stopPropagation: jasmine.createSpy('event.stopPropagation'),
             };
            deferred = $q.defer();
            deferred.resolve(data);
            spyOn(scope, "$on");
            spyOn(ScenarioService, "get").and.returnValue(deferred.promise);
            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
            spyOn(SortAndFilterService, "filter");
            spyOn(SortAndFilterService, "init").and.callThrough();
            
            ctrl = $controller('ProjectListingCtrl', {
                $scope: scope,
                Projects:data,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an api", function(){
            expect(scope.selectItem).toBeDefined();
        });

        it("should select an item", function(){
            scope.$apply(function(){
                scope.selectItem({}).then(function(){
                    expect(scope.selectedItem).toEqual({"scenarios": data});
                });
            });
        });

        it ("should extend Project View CTRL", function(){
            expect(scope.init).toBeDefined();
            expect(scope.goto).toBeDefined();
            expect(scope.isFavorite).toBeDefined();
            expect(scope.toggleFavorite).toBeDefined();
            expect(scope.action).toBeDefined();
            expect(scope.toggleShowScenarios).toBeDefined();
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getCount).toBeDefined();
            expect(scope.setFilter).toBeDefined();
        });

        it("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.ProjectManager.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.ProjectManager.displayActionsCreate);
        });

        it("should set all event handlers", function(){
            expect(scope.$on).toHaveBeenCalledWith( EVENTS.createProject, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith( EVENTS.getNewProjectTitle, jasmine.any(Function));
        });


        it('should set the master project as a favorite', function(){
            expect(FavoritesService.getFavorites()).toContain('456');
        });

        it("should pass all data to SortAndFilterService", function(){
            expect(SortAndFilterService.init).toHaveBeenCalledWith(
                {data:data, orderBy:CONFIG.view[$state.current.name].orderBy, filter:{label : 'All Projects', filterType : 'activeFilter', filter : {  } }, reverse:CONFIG.view[$state.current.name].reverse}
                );
        });

        it("should toggle favorites", function(){
            var data = {id: "123"};
            scope.toggleFavorite(event, data);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(FavoritesService.toggleFavorite).toHaveBeenCalledWith(data.id, "project");
            expect(SortAndFilterService.filter).toHaveBeenCalled();
        });

        it("should determine if an item is favorited", function(){
            FavoritesService.addFavorite("123");
            FavoritesService.addFavorite("345");
            expect(scope.isFavorite("123")).toBe(true);
            expect(scope.isFavorite("555")).toBe(false);
            expect(scope.isFavorite("345")).toBe(true);
        });

        it("should get selected project", function(){
            var data = "1";
            scope.showDetails(data);
            expect(scope.getProject()).toBe(data);
        });

    });

    describe("Scenario Listing CTRL", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_, _EVENTS_, _SortAndFilterService_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            EVENTS = _EVENTS_;
            SortAndFilterService = _SortAndFilterService_;
            $state = _$state_;
            $state.current.name = "Dashboard";
            data = {id:"123", title:"title", description: "description", isMaster:false};
            spyOn(scope, "$on");
            spyOn(SortAndFilterService, "init");
            ctrl = $controller('ScenarioListingCtrl', {
                $scope: scope,
                '$stateParams': {projectId:"foo"},
                Favorites: {},
                Scenarios: data,
                Project: data
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.getProject).toBeDefined();
            expect(scope.showDetails).toBeDefined();
        });

        it("should get the project", function(){
            expect(scope.getProject()).toBe(data);
        });

        it("should set the active item", function(){
            scope.selectItem(data);
            expect(scope.selectedItem).toEqual(data);
        });

        it("should set event listeners", function(){
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.gotoScenarioCreate, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.copyScenario, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.renameScenario, jasmine.any(Function));
        });


        it("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.Dashboard.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.Dashboard.displayActionsCreate);
        });

        it ("should extend Project View CTRL", function(){
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getCount).toBeDefined();
            expect(scope.setFilter).toBeDefined();
        });

        it("should pass all data to SortAndFilterService", function(){
            expect(SortAndFilterService.init).toHaveBeenCalledWith(
                {data:data, orderBy:CONFIG.view[$state.current.name].orderBy, filter:{label : 'all scenarios', filterType : 'activeFilter', filter : {  } }, reverse:CONFIG.view[$state.current.name].reverse}
                );
        });
    });

    describe("Listing View CTRL", function(){

         beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _SortAndFilterService_, _GotoService_, $q, _$httpBackend_ ) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            scope.getProject = function(){return {id: '123'};};
            SortAndFilterService = _SortAndFilterService_;
            GotoService = _GotoService_;
            spyOn(GotoService, "scenarioEdit");
            spyOn(GotoService, "dashboard");
            spyOn(GotoService, "projects");
            spyOn(GotoService, "scenarioCreate");
            spyOn(SortAndFilterService, "getData").and.returnValue(data);
            spyOn(SortAndFilterService, "getSelectedLabel").and.returnValue("foo");
            spyOn(SortAndFilterService, "getCount").and.returnValue(1);
            spyOn(SortAndFilterService, "setFilter");
            scope.getProjects = jasmine.createSpy("scope.getProjects");
            event = {
                stopPropagation: jasmine.createSpy('event.stopPropagation'),
            };
            data = {id:"123", title:"title", description: "description", isMaster:false};
            deferred = $q.defer();
            deferred.resolve(data);

            ctrl = $controller('ListingViewCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.goto).toBeDefined();
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getCount).toBeDefined();
            expect(scope.setFilter).toBeDefined();
        });

        it("should goto various places", function(){
            var id = '123', data = {id:id};
            scope.goto(event, "gotoScenarioEdit", data);
            expect(GotoService.scenarioEdit).toHaveBeenCalledWith(id, id);
            scope.goto(event, "gotoDashboard", data);
            expect(GotoService.dashboard).toHaveBeenCalledWith(id);
            scope.goto(event, "gotoProjects");
            expect(GotoService.projects).toHaveBeenCalled();
        });

        it("should show details", function(){
            scope.showDetails(data);
            expect(scope.selectedItem).toBe(data);
        });

        it("should check active item", function(){
            scope.showDetails(data);
            expect(scope.isActiveItem(data)).toBe(true);
        });

        it("should get the data", function(){
            expect(scope.getData()).toEqual(data);
        });

        it("should get the sorter", function(){
            var data = "foo";
            SortAndFilterService.setSorter(123, data);
            expect(scope.getSorter(123)).toEqual(data);

        });

        it("should get the count of data items", function(){
            expect(scope.getCount()).toEqual(1);
        });

        it("should set the filters", function(){
            scope.setFilter("foo", data, true);
            expect(SortAndFilterService.setFilter).toHaveBeenCalledWith("foo", data, true);
        });

    });
});