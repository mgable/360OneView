"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsModel){return ProjectsModel.get();},
        'Favorites': function(FavoritesModel) {return FavoritesModel.get();}
      }
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectDashboardCtrl",
      resolve: {
        'Projects': function(ProjectsModel){return ProjectsModel.get();},
        'Scenarios': function(ScenarioModel, $stateParams){return ScenarioModel.get($stateParams.projectId);}
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