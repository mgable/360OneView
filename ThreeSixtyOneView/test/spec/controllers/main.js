/* jshint unused:false */

'use strict';

describe('Controllers: ', function() {
    var scope, ctrl, spy, $state, SortAndFilterService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService, CONFIG, Urlmaker, $rootScope, onSpy;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    describe("MainCtrl: ", function(){
        beforeEach(inject(function($rootScope, $controller, _SortAndFilterService_,  _ActiveSelection_, _InfoTrayService_, _DiaglogService_, _FavoritesService_, _ViewService_) {
            scope = $rootScope.$new();
            ctrl = $controller('MainCtrl', {
                $scope: scope,
                SortAndFilterService: _SortAndFilterService_,
                ActiveSelection: _ActiveSelection_,
                InfoTrayService: _InfoTrayService_,
                DiaglogService: _DiaglogService_,
                FavoritesService: _FavoritesService_,
                ViewService: _ViewService_
            });
        }));

        it("should define all services", function(){
            expect(scope.SortAndFilterService).toBeDefined();
            expect(scope.ActiveSelection).toBeDefined();
            expect(scope.InfoTrayService).toBeDefined();
            expect(scope.ViewService).toBeDefined();
            expect(scope.FavoritesService).toBeDefined();
            expect(scope.DiaglogService).toBeDefined();
        });
    });

    describe("ManagerCtrl", function(){
        beforeEach(inject(function(_$rootScope_, _$state_, $controller, _InfoTrayService_, _CONFIG_, _ViewService_, _Urlmaker_, _ActiveSelection_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            ViewService = _ViewService_;
            InfoTrayService = _InfoTrayService_;
            Urlmaker = _Urlmaker_;
            $state = _$state_;
            $state.current.name = "ProjectManager";
            onSpy = spyOn(scope, "$on").and.callThrough();
            ctrl = $controller('ManagerCtrl', {
                $scope: scope,
                ViewService: _ViewService_,
                ActiveSelection: _ActiveSelection_,
                '$stateParams': {projectName:"foo"},
                Projects:{}
            });
        }));

        it("should bootstrap all data", function(){
            expect(scope.data).toEqual({});
            expect(scope.CONFIG).toBeDefined();
            expect(scope.CONFIG.hasFavorites).toEqual(CONFIG.view.ProjectManager.hasFavorites);
            expect(scope.CONFIG.topInclude).toBeFalsy();
            expect(scope.CONFIG.status).toBeFalsy();
            expect(scope.CONFIG.projectName).toBe("foo");
            expect(scope.CONFIG.filterMenu).toBe(CONFIG.view.ProjectManager.filterMenu);
            expect(scope.CONFIG.displayActionsCreate).toBe(CONFIG.view.ProjectManager.displayActionsCreate);
        });

        it("should define an api", function(){
            var spy = spyOn(Urlmaker, "gotoView"),  $event = {stopPropagation:angular.noop};
            expect(scope.goto).toBeDefined();
            scope.goto($event, "gotoScenarioEdit", {foo: "bar"});
            expect(spy).toHaveBeenCalledWith('scenarioEdit','foo', {foo:'bar'});
            spy.calls.reset();
            scope.goto($event, "gotoDashboard", {title: "bar"});
            expect(spy).toHaveBeenCalledWith('dashboard', {title: "bar"});
            spy.calls.reset();
            scope.goto($event, "gotoProjects");
            expect(spy).toHaveBeenCalled();
        });

        it("should attach event listeners", function(){
            var spy = spyOn(Urlmaker, "gotoView"),  $event = {stopPropagation:angular.noop};
            expect(onSpy.calls.argsFor(0)).toContain("scenario:create");
            expect(onSpy.calls.argsFor(1)).toContain("ProjectsModel:create");
            
            $rootScope.$broadcast("scenario:create");
            expect(spy).toHaveBeenCalledWith("scenarioCreate", "foo");
            spy.calls.reset();
            $rootScope.$broadcast("ProjectsModel:create", {"title": "bar"});
            expect(spy).toHaveBeenCalledWith("dashboard",  "bar");
        });
    });
});