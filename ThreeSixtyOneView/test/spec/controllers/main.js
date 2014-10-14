/* jshint unused:false */
/* global xit */

'use strict';

describe('Controllers: ', function() {
    var scope, ctrl, spy, $state, SortAndFilterService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, CONFIG, $rootScope, onSpy;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    describe("MainCtrl: ", function(){
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('MainCtrl', {
                $scope: scope,
            });
        }));

    });

    describe("ProjectListingCtrl", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller, _InfoTrayService_, _CONFIG_,  _ActiveSelection_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            InfoTrayService = _InfoTrayService_;
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