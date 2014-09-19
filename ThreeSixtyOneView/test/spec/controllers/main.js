/* jshint unused:false */

'use strict';

describe('Controllers: ', function() {
    var scope, ctrl, spy, SortAndFilterService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService, CONFIG, Urlmaker, $rootScope, onSpy;

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
        beforeEach(inject(function(_$rootScope_, $controller, _CONFIG_, _ViewService_, _Urlmaker_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            CONFIG = _CONFIG_;
            ViewService = _ViewService_;
            Urlmaker = _Urlmaker_;
            spy = spyOn(ViewService, "getCurrentView").and.returnValue("ProjectManager");
            onSpy = spyOn(scope, "$on").and.callThrough();
            ctrl = $controller('ManagerCtrl', {
                $scope: scope,
                ViewService: _ViewService_,
                '$routeParams': {projectName:"foo"}
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
            scope.goto("gotoScenarioEdit", {foo: "bar"}, $event);
            expect(spy).toHaveBeenCalledWith('scenarioEdit','foo', {foo:'bar'});
            spy.calls.reset();
            scope.goto("gotoDashboard", {title: "bar"}, $event);
            expect(spy).toHaveBeenCalledWith('dashboard', 'bar');
            spy.calls.reset();
            scope.goto("gotoProjects", {}, $event);
            expect(spy).toHaveBeenCalled();
        });

        it("should attach event listeners", function(){
            var spy = spyOn(Urlmaker, "gotoView"),  $event = {stopPropagation:angular.noop};
            expect(onSpy.calls.argsFor(0)).toContain("scenario:create");
            expect(onSpy.calls.argsFor(1)).toContain("ProjectCreateCtrl:create");
            
            $rootScope.$broadcast("scenario:create");
            expect(spy).toHaveBeenCalledWith("scenarioCreate", "foo");

            $rootScope.$broadcast("ProjectCreateCtrl:create", {"name": "bar"});
            expect(spy).toHaveBeenCalledWith("dashboard", {"name": "bar"});
        });
    });
});