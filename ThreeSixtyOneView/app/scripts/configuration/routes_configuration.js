"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ManagerCtrl",
      resolve: {
        'Projects': function(ProjectsModel){return ProjectsModel.get();}
      }
    })
    .state('Dashboard', {
      url: "/dashboard/:projectName",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ManagerCtrl",
      resolve: {
        'Projects': function(ProjectsModel){return ProjectsModel.get();}
      }
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