"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsService){return ProjectsService.get();},
        'Favorites': function(FavoritesService) {return FavoritesService.get();}
      },
      breadcrumb: "All Projects"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectDashboardCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
      },
      breadcrumb: "All Projects > {{title}}"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectId",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}

      },
      breadcrumb: "All Projects > {{title}}"
    })
    .state('ScenarioEdit', {
      url: "/scenarioEdit/:projectId/:scenarioId",
      templateUrl: "views/scenario_edit.tpl.html",
      controller: "ScenarioEditCtrl",
      breadcrumb: "All Projects > {{title}}"
    });
}]);