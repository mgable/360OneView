"use strict";

// angular.module('ThreeSixtyOneView').config(function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: 'views/display_manager.tpl.html',
//             controller: 'ManagerCtrl',
//             viewName: "ProjectManager"
//         })
//         .when('/scenarioEdit/:project/:scenario', {
//             templateUrl: 'views/scenario_edit.tpl.html',
//             controller: 'ScenarioEditCtrl'
//         })
//         .when('/scenarioCreate/:projectName', {
//             templateUrl: 'views/scenario_create.tpl.html',
//             controller: 'ScenarioCreateCtrl'
//         })
//         .when('/projects', {
//             templateUrl: 'views/display_manager.tpl.html',
//             controller: 'ManagerCtrl',
//             viewName: "ProjectManager"
//         })
//         .when('/dashboard/:projectName', {
//             templateUrl: 'views/display_manager.tpl.html',
//             controller: 'ManagerCtrl',
//             viewName: "Dashboard"
//         })
//         .otherwise({
//             redirectTo: '/'
//         });
// });

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ManagerCtrl"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectName",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ManagerCtrl"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectName",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl"
    })
    .state('ScenarioEdit', {
      url: "/scenarioEdit/:project/:scenario",
      templateUrl: "views/scenario_edit.tpl.html",
      controller: "ScenarioEditCtrl"
    });
}]);