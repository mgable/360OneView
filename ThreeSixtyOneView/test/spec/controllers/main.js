/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: ', function() {
    var Projects, EVENTS, rootScope, data, scope, ctrl, spy, $state, SortAndFilterService, ActiveSelection, DiaglogService, FavoritesService, CONFIG, $rootScope, onSpy, $provide, event, GotoService, deferred, $httpBackend, filterSpy, isFavoriteSpy;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    describe("Main CTRL: ", function(){
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('MainCtrl', {
                $scope: scope,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
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
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_, _FavoritesService_, _SortAndFilterService_, _ActiveSelection_ ) {
            $rootScope = _$rootScope_;
            FavoritesService = _FavoritesService_;
            SortAndFilterService = _SortAndFilterService_;
            ActiveSelection = _ActiveSelection_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            $state = _$state_;
            $state.current.name = "ProjectManager";
            event = {
              stopPropagation: jasmine.createSpy('event.stopPropagation'),
             };
            spyOn(scope, "$on");
            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
            spyOn(SortAndFilterService, "filter");
            spyOn(SortAndFilterService, "init").and.callThrough();
            spyOn(ActiveSelection, "getActiveItem").and.callThrough();
            // spyOn(scope, "selectItem").and.callThrough();
            data = [{id:"123", title:"title", isMaster:false},{id:"234", title:"title", isMaster:false},{id:"456", title:"title master", isMaster:true}];
            ctrl = $controller('ProjectListingCtrl', {
                $scope: scope,
                '$stateParams': {projectId:"123"},
                Projects:data,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an api", function(){
            expect(scope.toggleFavorite).toBeDefined();
            expect(scope.isFavorite).toBeDefined();
            expect(scope.getProject).toBeDefined();
            expect(scope.selectItem).toBeDefined();
        });

        it ("should extend Project View CTRL", function(){
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getSelectedLabel).toBeDefined();
            expect(scope.getCount).toBeDefined();
            expect(scope.setFilter).toBeDefined();
        });

        it("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).toEqual(CONFIG.view.ProjectManager.hasFavorites);
            expect(scope.CONFIG.topInclude).toBeFalsy();
            expect(scope.CONFIG.projectId).toBe("123");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.ProjectManager.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.ProjectManager.displayActionsCreate);
        });

        it("should set all event handlers", function(){
            expect(scope.$on).toHaveBeenCalledWith( 'DialogService:openCreateProject', jasmine.any(Function));
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
            var data = "123";
            scope.toggleFavorite(event, data);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(FavoritesService.toggleFavorite).toHaveBeenCalledWith(data, "project");
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
            ActiveSelection.setActiveItem(data);
            expect(scope.getProject()).toBe(data);
        });

    });

    describe("InfoTray CTRL", function(){
        beforeEach(inject(function(_$rootScope_, $controller, ActiveSelection, _EVENTS_, FavoritesService, SortAndFilterService, _CONFIG_, _$state_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            data = {"foo": "bar"};
            EVENTS = _EVENTS_;
            CONFIG = _CONFIG_;
            filterSpy = spyOn(SortAndFilterService, "filter");
            isFavoriteSpy = spyOn(FavoritesService, "isFavorite");
            spyOn(ActiveSelection, "getActiveItem").and.returnValue(data);
            spyOn(scope, "$on");
            spyOn(scope, "$broadcast");
            spyOn($rootScope, "$broadcast");
            $state = _$state_;
            $state.current.name = "Dashboard";
            spy = spyOn(FavoritesService, "toggleFavorite");
            ctrl = $controller('InfoTrayCtrl', {
                $scope: scope,
                $state: {current: {name: "Dashboard"}}
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should bootstrap all data", function(){
            expect(scope.selectedItem).toBe(data);
            expect(scope.showScenario).toBe(false);
            expect(scope.viewAll).toBe('View All');
            expect(scope.trayActions).toEqual(CONFIG.view[$state.current.name].trayActions);
        });

        it("should define an API", function(){
            expect(scope.action).toBeDefined();
            expect(scope.toggleShowScenarios).toBeDefined();
        });

        it("should broadcast when an action is recevied", function(){
            scope.action("test", data);
            expect($rootScope.$broadcast).toHaveBeenCalledWith(EVENTS['test'], 'test', data);
        });

        it("should toggle the seem more view of scenarios", function(){
            expect(scope.showScenario).toBe(false);
            expect(scope.viewAll).toBe('View All');

            scope.toggleShowScenarios();

            expect(scope.showScenario).toBe(true);
            expect(scope.viewAll).toBe('View Less');

            scope.toggleShowScenarios();

            expect(scope.showScenario).toBe(false);
            expect(scope.viewAll).toBe('View All');
        });

        it("should set event listeners", function(){
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.changeActiveItem, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.trayCopy, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.noop, jasmine.any(Function));
        });
    });

    describe("Project Dashboard CTRL", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_, _EVENTS_, _SortAndFilterService_, ActiveSelection ) {
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
            spy = spyOn(ActiveSelection, "setActiveItem");
            ctrl = $controller('ProjectDashboardCtrl', {
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
            expect(spy).toHaveBeenCalledWith(data);
        });

        it("should set event listeners", function(){
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.gotoScenarioCreate, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.copyScenario, jasmine.any(Function));
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.renameScenario, jasmine.any(Function));
        });


        it("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.projectId).toBe("foo");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.Dashboard.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.Dashboard.displayActionsCreate);
        });

        it ("should extend Project View CTRL", function(){
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getSelectedLabel).toBeDefined();
            expect(scope.getCount).toBeDefined();
            expect(scope.setFilter).toBeDefined();
        });

        it("should pass all data to SortAndFilterService", function(){
            expect(SortAndFilterService.init).toHaveBeenCalledWith(
                {data:data, orderBy:CONFIG.view[$state.current.name].orderBy, filter:{label : 'all scenarios', filterType : 'activeFilter', filter : {  } }, reverse:CONFIG.view[$state.current.name].reverse}
                );
        });
    });

    describe("Project View CTRL", function(){

         beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _SortAndFilterService_, _ActiveSelection_, _GotoService_, $q, _$httpBackend_ ) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            scope.getProject = function(){return {id: '123'};};
            SortAndFilterService = _SortAndFilterService_;
            ActiveSelection = _ActiveSelection_;
            GotoService = _GotoService_;
            spyOn(GotoService, "scenarioEdit");
            spyOn(GotoService, "dashboard");
            spyOn(GotoService, "projects");
            spyOn(GotoService, "scenarioCreate");
            spyOn(ActiveSelection, "setActiveItem").and.callThrough();
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

            ctrl = $controller('ProjectViewCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should define an API", function(){
            expect(scope.goto).toBeDefined();
            expect(scope.getDetails).toBeDefined();
            expect(scope.showDetails).toBeDefined();
            expect(scope.isActiveItem).toBeDefined();
            expect(scope.getData).toBeDefined();
            expect(scope.getSorter).toBeDefined();
            expect(scope.getSelectedLabel).toBeDefined();
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
            scope.goto(event, "gotoScenarioCreate", data);
            expect(GotoService.scenarioCreate).toHaveBeenCalledWith(id);
        });

        it("should show details", function(){
            scope.showDetails(data);
            expect(ActiveSelection.setActiveItem).toHaveBeenCalledWith(data);
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

        it("should get the selected label", function(){
            expect(scope.getSelectedLabel()).toEqual("foo");
        });

        it("should get the count of data items", function(){
            expect(scope.getCount()).toEqual(1);
        });

        it("should set the filters", function(){
            scope.setFilter("foo", data, true);
            expect(SortAndFilterService.setFilter).toHaveBeenCalledWith("foo", data, true);
        });

        it("should get details", function(){
            scope.getDetails(data, function(id){return deferred.promise;}, 'foo');
            scope.$digest();
            expect(ActiveSelection.setActiveItem).toHaveBeenCalledWith(data);
        });

    });
});