/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: ', function() {
    var rootScope, data, scope, ctrl, spy, $state, SortAndFilterService, ActiveSelection, DiaglogService, FavoritesService, CONFIG, $rootScope, onSpy, $provide, event;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    describe("MainCtrl: ", function(){
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('MainCtrl', {
                $scope: scope,
            });
        }));

    });

     beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    describe("Navigation CTRL:", function(){
        beforeEach(inject(function($rootScope, $controller, $httpBackend, ProjectsService) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $state = {current: {breadcrumb: "All {{title}}"}};
            data = {title: "Projects"};
            spy = spyOn(scope, "$on").and.callThrough();
            spyOn(ProjectsService, "getProjectItemById").and.returnValue(data);
            $provide.value("$state", $state);
            $provide.value("$stateParams", {projectId: '1'});
            ctrl = $controller('NavigationCtrl', {
                $scope: scope,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });
    });

    describe("ProjectListing Ctrl", function(){
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

            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
            spyOn(SortAndFilterService, "filter");
            spyOn(ActiveSelection, "getActiveItem").and.callThrough();
            ctrl = $controller('ProjectListingCtrl', {
                $scope: scope,
                '$stateParams': {projectName:"foo"},
                Projects: {},
                Favorites: {},

            });
        }));

        xit("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        xit("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).toEqual(CONFIG.view.ProjectManager.hasFavorites);
            expect(scope.CONFIG.topInclude).toBeFalsy();
            expect(scope.CONFIG.projectName).toBe("foo");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.ProjectManager.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.ProjectManager.displayActionsCreate);
        });

        xit("should define an api", function(){
            expect(scope.toggleFavorite).toBeDefined();
            expect(scope.isFavorite).toBeDefined();
            expect(scope.getProject).toBeDefined();
        });

        xit("should toggle favorites", function(){
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

        xit("should get selected project", function(){
            var data = "1";
            ActiveSelection.setActiveItem(data);
            expect(scope.getProject()).toBe(data);
        });

    });

    describe("Projectdashboard CTRL", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_ ) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            $state = _$state_;
            $state.current.name = "Dashboard";
            event = {
              stopPropagation: jasmine.createSpy('event.stopPropagation'),
             };

            spyOn(FavoritesService, "toggleFavorite");
            spyOn(FavoritesService, "isFavorite").and.callThrough();
            spyOn(SortAndFilterService, "filter");
            spyOn(ActiveSelection, "getActiveItem").and.callThrough();
            ctrl = $controller('ProjectDashboardCtrl', {
                $scope: scope,
                '$stateParams': {projectName:"foo"},
                Projects: {},
                Favorites: {},
                Scenarios: {data:[]}
            });
        }));

        xit("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        xit("should bootstrap all data", function(){
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).not.toBeDefined();
            expect(scope.CONFIG.topInclude).toBeDefined();
            expect(scope.CONFIG.projectName).toBe("foo");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.Dashboard.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.Dashboard.displayActionsCreate);
        });
    });
});