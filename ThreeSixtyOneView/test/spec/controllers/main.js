/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: ', function() {
    var Projects, SortAndFilterService, DiaglogService, FavoritesService, onSpy, $provide, event, GotoService, filterSpy, isFavoriteSpy, ErrorService, ScenarioService;

    var $httpBackend, $rootScope, $state, $controller, $q, scope, CONFIG, EVENTS, SERVER;

    var data, ctrl, spy, deferred, signature, scenarios;

    var getAPI = function(scope){
        var api = [];
        _.each(_.keys(scope), function(key){
            if (!_.isNull(key)){
                var item = key.toString();
                if (/^[^$]/.test(item)){
                    api.push(item);
                }
            }
        });
        return api;
    },
    equals = function (array1, array2){
        var length = array1.length;
        if (array1.length !== array2.length){
            return false
        }
        array1.sort();
        array2.sort();
        
        for(var i = 0, limit =length; i < limit; i++){
            if (array1[i] !== array2[i]){
                return false;
            }
        }

        return true;
    }

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$state_, _$controller_, _$q_, _CONFIG_, _EVENTS_, _SERVER_){
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $state = _$state_;
        $controller = _$controller_;
        $q = _$q_;
        scope = $rootScope.$new();
        CONFIG = _CONFIG_;
        EVENTS = _EVENTS_;
        SERVER = _SERVER_.server;
    }));

    describe("Main CTRL: ", function(){
        beforeEach(inject(function(_ErrorService_) {
            ErrorService = _ErrorService_;
            signature = ['this', 'ErrorService', 'console', 'alert'];
            ctrl = $controller('MainCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should have a defined api", function(){
            var api = getAPI(scope);
            expect(equals(api, signature)).toEqual(true);
        });

        it("should import Error Service", function(){
            expect(scope.ErrorService).toBe(ErrorService);
        });
    });

    describe("Project Listing CTRL", function(){
        beforeEach(inject(function(_FavoritesService_, _SortAndFilterService_, _ScenarioService_) {
            data = [{id:"123", title:"title", isMaster:false},{id:"234", title:"title", isMaster:false},{id:"456", title:"title master", isMaster:true}];
            deferred = $q.defer();
            deferred.resolve(data);

            FavoritesService = _FavoritesService_;
            ScenarioService = _ScenarioService_;
            SortAndFilterService = _SortAndFilterService_;

            $state.current.name = "ProjectManager";
            signature = ['this', 'init', 'getDetails', 'goto', 'showDetails', 'isActiveItem', 'getData', 'getSorter', 'getCount', 'setFilter', 'toggleFavorite', 'isFavorite', 'action', 'selectItem', 'CONFIG', 'data', 'selectedItem', 'getProject', 'trayActions'];
            event = {
                stopPropagation: jasmine.createSpy('event.stopPropagation'),
            };
            
            spyOn(scope, "$on");
            spyOn(ScenarioService, "get").and.returnValue(deferred.promise);
            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
            spyOn(SortAndFilterService, "filter");
            spyOn(SortAndFilterService, "init").and.callThrough();

            $httpBackend.expectPOST(SERVER + "/rubix/v1/favorite/project").respond({});
            $httpBackend.expectGET(SERVER + "/rubix/v1/project").respond({});
            $httpBackend.expectGET(SERVER + "/rubix/v1/favorite/project").respond({});
            $httpBackend.expectGET("views/projects.tpl.html").respond({});

            ctrl = $controller('ProjectListingCtrl', {
                $scope: scope,
                Projects: data,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should have a defined api", function(){
            var api = getAPI(scope);
            expect(equals(api, signature)).toEqual(true);
        });

        // API
        it("should select an item", function(){
            scope.$apply(function(){
                scope.selectItem({}).then(function(){
                    expect(scope.selectedItem).toEqual({"scenarios": data});
                });
            });
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

        //API
        it("should toggle favorites", function(){
            var data = {id: "123"};
            scope.toggleFavorite(event, data);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(FavoritesService.toggleFavorite).toHaveBeenCalledWith(data.id, "project");
            expect(SortAndFilterService.filter).toHaveBeenCalled();
        });

        //API
        it("should determine if an item is favorited", function(){
            FavoritesService.addFavorite("123");
            FavoritesService.addFavorite("345");
            expect(scope.isFavorite("123")).toBe(true);
            expect(scope.isFavorite("555")).toBe(false);
            expect(scope.isFavorite("345")).toBe(true);
        });
    });

    describe("Scenario Listing CTRL", function(){
        beforeEach(inject(function(_SortAndFilterService_, ManageScenariosService, _FavoritesService_) {
            scenarios = [{title:"foo"}, {title: "bar"}, {title: "foobar"}];
            data = {id:"123", title:"title", description: "description", isMaster:false};
            deferred = $q.defer();
            deferred.resolve(data);

            SortAndFilterService = _SortAndFilterService_;
            FavoritesService = _FavoritesService_;

            $state.current.name = "Dashboard";
            signature = [ 'this', 'init', 'getDetails', 'goto', 'showDetails', 'isActiveItem', 'getData', 'getSorter', 'getCount', 'setFilter', 'toggleFavorite', 'isFavorite', 'action', 'selectItem', 'isScenarioTitleUnique', 'CONFIG', 'data', 'selectedItem', 'getProject', 'trayActions', 'project', 'scenarios', 'hasAlerts' ];
            
            spyOn(scope, "$on");
            spyOn(SortAndFilterService, "filter");
            spyOn(SortAndFilterService, "init");
            spyOn(SortAndFilterService, "getData").and.returnValue([data]);
            spyOn(ManageScenariosService, "get").and.returnValue(deferred.promise);
            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
             event = {
                stopPropagation: jasmine.createSpy('event.stopPropagation'),
            };

            $httpBackend.expectGET(SERVER + "/rubix/v1/project").respond({});
            $httpBackend.expectGET(SERVER + "/rubix/v1/favorite/project").respond({});
            $httpBackend.expectGET("views/projects.tpl.html").respond({});

            ctrl = $controller('ScenarioListingCtrl', {
                $scope: scope,
                '$stateParams': {projectId: "foo"},
                Favorites: {},
                Scenarios: scenarios,
                Project: data,
                Status: data
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should have a defined api", function(){
            var api = getAPI(scope);
            expect(equals(api, signature)).toEqual(true);
        });

        it("should get the project", function(){
            expect(scope.getProject()).toBe(data);
        });

        //API
        it("should toggle favorites", function(){
            var data = {id: "123"};
            scope.toggleFavorite(event, data);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(FavoritesService.toggleFavorite).toHaveBeenCalledWith(data.id, "scenario");
            expect(SortAndFilterService.filter).toHaveBeenCalled();
        });

        //API
        it("should determine if an item is favorited", function(){
            FavoritesService.addFavorite("123");
            FavoritesService.addFavorite("345");
            expect(scope.isFavorite("123")).toBe(true);
            expect(scope.isFavorite("555")).toBe(false);
            expect(scope.isFavorite("345")).toBe(true);
        });

        //API
        it("should set the active item", function(){
            scope.$apply(function(){
                scope.selectItem({}).then(function(response){
                    expect(scope.selectedItem).toEqual({scenarioElements: data});
                });
            })
        });

        //API
        it("should determine if a scenario title is unique", function(){
            console.info(scope.scenarios);
            expect(scope.isScenarioTitleUnique("bar")).toBe(false);
            expect(scope.isScenarioTitleUnique("foobarbuzz")).toBe(true);
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


        it("should pass all data to SortAndFilterService", function(){
            expect(SortAndFilterService.init).toHaveBeenCalledWith(
                {data:scenarios, orderBy:CONFIG.view[$state.current.name].orderBy, filter:{label : 'all scenarios', filterType : 'activeFilter', filter : {  } }, reverse:CONFIG.view[$state.current.name].reverse}
                );
        });
    });

    describe("Listing View CTRL", function(){

        beforeEach(inject(function(_SortAndFilterService_, _GotoService_) {
            signature = ['this', 'getProject', 'getProjects', 'init', 'getDetails', 'goto', 'showDetails', 'isActiveItem', 'getData', 'getSorter', 'getCount', 'setFilter', 'toggleFavorite', 'isFavorite', 'action'];
            data = {id:"123", title:"title", description: "description", isMaster:false};
            deferred = $q.defer();
            deferred.resolve(data);
            scope.getProject = function(){return {id: '123'};};

            SortAndFilterService = _SortAndFilterService_;
            GotoService = _GotoService_;

            spyOn(GotoService, "scenarioEdit");
            spyOn(GotoService, "dashboard");
            spyOn(GotoService, "projects");
            spyOn(GotoService, "scenarioCreate");
            spyOn($rootScope, "$broadcast");

            spyOn(SortAndFilterService, "getData").and.returnValue(data);
            spyOn(SortAndFilterService, "getSelectedLabel").and.returnValue("foo");
            spyOn(SortAndFilterService, "getCount").and.returnValue(1);
            spyOn(SortAndFilterService, "setFilter");
            scope.getProjects = jasmine.createSpy("scope.getProjects");

            event = {
                stopPropagation: jasmine.createSpy('event.stopPropagation'),
            };

            ctrl = $controller('ListingViewCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should have a defined api", function(){
            var api = getAPI(scope);
            expect(equals(api, signature)).toEqual(true);
        });

        //API
        it("should goto various places", function(){
            var id = '123', data = {id:id};
            scope.goto(event, "gotoScenarioEdit", data, id);
            expect(GotoService.scenarioEdit).toHaveBeenCalledWith(id, id, id);
            scope.goto(event, "gotoDashboard", data);
            expect(GotoService.dashboard).toHaveBeenCalledWith(id);
            scope.goto(event, "gotoProjects");
            expect(GotoService.projects).toHaveBeenCalled();
        });

        //API
        it("should show details", function(){
            scope.showDetails(data);
            expect(scope.selectedItem).toBe(data);
        });

        //API
        it("should check active item", function(){
            scope.showDetails(data);
            expect(scope.isActiveItem(data)).toBe(true);
        });

        //API
        it("should get the data", function(){
            expect(scope.getData()).toEqual(data);
        });

        //API
        it("should get the sorter", function(){
            var data = "foo";
            SortAndFilterService.setSorter(123, data);
            expect(scope.getSorter(123)).toEqual(data);
        });

        //API
        it("should get the count of data items", function(){
            expect(scope.getCount()).toEqual(1);
        });

        //API
        it("should broadcast an action", function(){
            var data = {foo: "bar"};
            scope.action("test", data);
            expect(scope.$broadcast).toHaveBeenCalledWith("test", "test", data)
        });

        //API
        it("should set the filters", function(){
            scope.setFilter("foo", data, true);
            expect(SortAndFilterService.setFilter).toHaveBeenCalledWith("foo", data, true);
        });
    });
});