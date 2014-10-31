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

    describe("ProjectListing CTRL", function(){
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
                Favorites: ["123", "345", "333"],
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
                {data:data, orderBy:CONFIG.view[$state.current.name].orderBy, filter:{label : 'All', filterType : 'activeFilter', filter : {  } }, reverse:CONFIG.view[$state.current.name].reverse}
                );
        });

        it("should define an api", function(){
            expect(scope.toggleFavorite).toBeDefined();
            expect(scope.isFavorite).toBeDefined();
            expect(scope.getProject).toBeDefined();
            expect(scope.selectItem).toBeDefined();
        });

        it("should toggle favorites", function(){
            var data = "123";
            scope.toggleFavorite(event, data);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(FavoritesService.toggleFavorite).toHaveBeenCalledWith(data);
            expect(SortAndFilterService.filter).toHaveBeenCalled();
        });

        xit("should determine if an item is favorited", function(){
            FavoritesService.setFavorites(["1", "3", "5"]);
            expect(scope.isFavorite("1")).toBe(true);
            expect(scope.isFavorite("2")).toBe(false);
        });

        it("should get selected project", function(){
            var data = "1";
            ActiveSelection.setActiveItem(data);
            expect(scope.getProject()).toBe(data);
        });

        it("should select the first item", function(){

            //console.info(scope.selectItem)
            //$scope.selectItem(SortAndFilterService.getData()[0]);
            //expect(scope.selectItem).toHaveBeenCalledWith("foo");
        });
    });

    describe("InfoTray CTRL", function(){
        beforeEach(inject(function($rootScope, $controller, ActiveSelection, _EVENTS_, FavoritesService, SortAndFilterService) {
            scope = $rootScope.$new();
            data = {"foo": "bar"};
            EVENTS = _EVENTS_;
            filterSpy = spyOn(SortAndFilterService, "filter");
            isFavoriteSpy = spyOn(FavoritesService, "isFavorite");
            spyOn(ActiveSelection, "getActiveItem").and.returnValue(data);
            spyOn(scope, "$on");
            spyOn(scope, "$broadcast");
            spy = spyOn(FavoritesService, "toggleFavorite");
            ctrl = $controller('InfoTrayCtrl', {
                $scope: scope,
                $state: {current: {name: "ProjectManager"}}
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should bootstrap all data", function(){
            expect(scope.selectedItem).toBe(data);
            expect(scope.showScenario).toBe(false);
            expect(scope.viewAll).toBe('View All');
            expect(scope.hasFavorites).toBe(CONFIG.view[$state.current.name].hasFavorites);
        });

        it("should define an API", function(){
            expect(scope.toggleFavorite).toBeDefined();
            expect(scope.isFavorite).toBeDefined();
            expect(scope.update).toBeDefined();
            expect(scope.toggleShowScenarios).toBeDefined();
        });

        it("should set event listeners", function(){
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.changeActiveItem, jasmine.any(Function));
        });

        it("should toggle favorites", function(){
            scope.toggleFavorite(1);
            expect(spy).toHaveBeenCalledWith(1);
            expect(filterSpy).toHaveBeenCalled();
        });

        it("should check if an item is a favorite", function(){
            scope.isFavorite(1);
            expect(isFavoriteSpy).toHaveBeenCalledWith(1);
        });

        it ("should update", function(){
            scope.update(1);
            expect(scope.$broadcast).toHaveBeenCalledWith(EVENTS.renameProject, 1);
        });

        it("should toggle scenario view", function(){
            expect(scope.showScenario).toBe(false);
            expect(scope.viewAll).toBe('View All');
            scope.toggleShowScenarios();
            expect(scope.showScenario).toBe(true);
            expect(scope.viewAll).toBe('View Less');
        });
    });

    describe("Projectdashboard CTRL", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_, _EVENTS_, _SortAndFilterService_ ) {
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
        });

        it("should set event listeners", function(){
            expect(scope.$on).toHaveBeenCalledWith(EVENTS.gotoScenarioCreate, jasmine.any(Function));
        });

        it("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).not.toBeDefined();
            expect(scope.CONFIG.topInclude).toBeDefined();
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

        xit("should get details", function(){
            scope.$apply(function(){
                scope.getDetails(data, function(id){return deferred.promise;}, 'foo');
            });
            
            expect(ActiveSelection.setActiveItem).toHaveBeenCalledWith("foo");
        });
    });
});