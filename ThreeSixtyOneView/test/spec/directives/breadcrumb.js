/* global xit */
'use strict';

describe('Directive: breadcrumb', function () {

  // load the directive's module
  beforeEach(module('ThreeSixtyOneView.directives', 'ThreeSixtyOneView.config', 'ThreeSixtyOneView.services'));

  var $rootScope, $state, $stateParams, $provide, state, element, data, deferred, GotoService,
    scope, spy;

  beforeEach(angular.mock.module(function (_$provide_) {
    $provide = _$provide_;
  }));

  beforeEach(inject(function (_$rootScope_, ProjectsService, $q, $compile, ScenarioService, _$state_, _$stateParams_, GotoService) {
    data = {title: "new title", description: "new description", id: 12345};
    deferred = $q.defer();
    deferred.resolve(data);
    spyOn(ProjectsService, "getProjectItemById").and.returnValue(data);
    spyOn(ScenarioService, "get").and.returnValue(deferred.promise);
    $rootScope = _$rootScope_;
    $state = _$state_;
    $stateParams = _$stateParams_;
    spy = spyOn(GotoService, "dashboard");
  }));

  it('should render Project Manager', inject(function ($compile) {
    var state = "ProjectManager",
    config = $state.get(state);
    $state.current.breadcrumb = config.breadcrumb;
    scope = $rootScope.$new();
    element = angular.element('<breadcrumb></breadcrumb>');
    element = $compile(element)(scope);
    $rootScope.$broadcast("$stateChangeSuccess");
    scope.$digest();
    expect(element.text()).toBe('All Projects');
  }));

  xit("should render Dashboard", inject(function($compile){
    var state = "Dashboard",
    config = $state.get(state);
    $state.current.breadcrumb = config.breadcrumb;
    $stateParams.projectId = "1234";
    scope = $rootScope.$new();
    element = angular.element('<breadcrumb></breadcrumb>');
    element = $compile(element)(scope);
    $rootScope.$broadcast("$stateChangeSuccess");
    scope.$digest();
    expect(element.text()).toBe('All Projectsnew title');
  }));

  it("should render Scenario", inject(function($compile){
    var state = "Scenario",
    config = $state.get(state);
    $state.current.breadcrumb = config.breadcrumb;
    $stateParams.projectId = "1234";
    $stateParams.scenarioId = "1234";
    scope = $rootScope.$new();
    element = angular.element('<breadcrumb></breadcrumb>');
    element = $compile(element)(scope);
    $rootScope.$broadcast("$stateChangeSuccess");
    scope.$digest();
    expect(element.text()).toBe('All Projectsnew titlenew title');
  }));

  it("should render scenario create", inject(function($compile){
    var state = "ScenarioCreate",
    config = $state.get(state);
    $state.current.breadcrumb = config.breadcrumb;
    $stateParams.projectId = "1234";
    scope = $rootScope.$new();
    element = angular.element('<breadcrumb></breadcrumb>');
    element = $compile(element)(scope);
    $rootScope.$broadcast("$stateChangeSuccess");
    scope.$digest();
    expect(element.text()).toBe('All Projectsnew title > Create Scenario');
  }));

  it("should render scenario edit", inject(function($compile){
    var state = "Scenario.edit",
    config = $state.get(state);
    $state.current.breadcrumb = config.breadcrumb;
    $stateParams.projectId = "1234";
    $stateParams.scenarioId = "1234";
    scope = $rootScope.$new();
    element = angular.element('<breadcrumb></breadcrumb>');
    element = $compile(element)(scope);
    $rootScope.$broadcast("$stateChangeSuccess");
    scope.$digest();
    expect(element.text()).toBe('All Projectsnew titlenew title');
  }));
});





