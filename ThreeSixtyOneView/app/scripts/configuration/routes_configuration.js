"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
<<<<<<< HEAD
        'Projects': function(ProjectsService){return ProjectsService.get();},
        'Favorites': function(FavoritesService) {return FavoritesService.get();}
=======
        'Projects': function(ProjectsModel){return ProjectsModel.get();},
        'Favorites': function(FavoritesModel) {return FavoritesModel.get();}
>>>>>>> 0cc78a6b9e51e812379e6482c9e34aaf18a52627
      }
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectDashboardCtrl",
      resolve: {
<<<<<<< HEAD
        'Projects': function(ProjectsService){return ProjectsService.get();},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
=======
        'Projects': function(ProjectsModel){return ProjectsModel.get();},
        'Scenarios': function(ScenarioModel, $stateParams){return ScenarioModel.get($stateParams.projectId);}
>>>>>>> 0cc78a6b9e51e812379e6482c9e34aaf18a52627
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