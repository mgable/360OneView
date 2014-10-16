/* jshint unused:false */
/* global xit */

'use strict';

describe('Controllers: ', function() {
    var rootScope, data, scope, ctrl, spy, $state, SortAndFilterService, ActiveSelection, DiaglogService, FavoritesService, CONFIG, $rootScope, onSpy, $provide;

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
            $provide.value("$stateParams", {projectId: '1'})
            ctrl = $controller('NavigationCtrl', {
                $scope: scope,
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should be watching $stateChangeSuccess", function(){
            expect(spy).toHaveBeenCalledWith('$stateChangeSuccess', jasmine.any(Function));
        });

        it("should set the breadcrumbs when the view is changed", function(){
            expect(scope.project).not.toBeDefined();
            rootScope.$broadcast("$stateChangeSuccess");
            expect(scope.project).toEqual(data);
            expect(scope.breadcrumbs).toEqual("All Projects");
        });
    });

    describe("ProjectListingCtrl", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller,  _CONFIG_,  _ActiveSelection_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            $state = _$state_;
            $state.current.name = "ProjectManager";
            onSpy = spyOn(scope, "$on").and.callThrough();
            ctrl = $controller('ProjectListingCtrl', {
                $scope: scope,
                ActiveSelection: _ActiveSelection_,
                '$stateParams': {projectName:"foo"},
                Projects: {},
                Favorites: {}
            });
        }));

        it("should bootstrap all data", function(){
            //expect(scope.data).toEqual({});
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).toEqual(CONFIG.view.ProjectManager.hasFavorites);
            expect(scope.CONFIG.topInclude).toBeFalsy();
            expect(scope.CONFIG.status).toBeFalsy();
            expect(scope.CONFIG.projectName).toBe("foo");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.ProjectManager.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.ProjectManager.displayActionsCreate);
        });

        xit("should define an api", function(){
            var spy = spyOn($state, "go"),  $event = {};
            expect(scope.goto).toBeDefined();
            scope.goto($event, "gotoScenarioEdit", "bar");
            expect(spy).toHaveBeenCalledWith('ScenarioEdit',  {project:'foo', scenario:'bar' });
            spy.calls.reset();
            scope.goto($event, "gotoDashboard", {title: "bar"});
            expect(spy).toHaveBeenCalledWith('Dashboard', {projectName: {title: "bar"}});
            spy.calls.reset();
            scope.goto($event, "gotoProjects");
            expect(spy).toHaveBeenCalled();
        });

        xit("should attach event listeners", function(){
            var spy = spyOn($state, "go"),  $event = {};
            expect(onSpy.calls.argsFor(0)).toContain("scenario:create");
            expect(onSpy.calls.argsFor(1)).toContain("ProjectsModel:create");
            
            $rootScope.$broadcast("scenario:create");
            expect(spy).toHaveBeenCalledWith("ScenarioCreate", {"projectName": "foo"});
            spy.calls.reset();
            $rootScope.$broadcast("ProjectsModel:create", {"title": "bar"});
            expect(spy).toHaveBeenCalledWith("Dashboard",  {"projectName": "bar"});
        });
    });
});