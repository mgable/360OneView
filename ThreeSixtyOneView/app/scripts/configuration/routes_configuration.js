"use strict";

angular.module('ThreeSixtyOneView.config').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/projects.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsService){return ProjectsService.get();},
        'Favorites': function(FavoritesService){return FavoritesService.get("project");}
      },
      breadcrumb: "<li>All Projects</li>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/projects.tpl.html",
      controller: "ScenarioListingCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);},
        'Favorites': function(FavoritesService, $stateParams){return FavoritesService.getFavoritesScenarios($stateParams.projectId);},
        'Status': function(ScenarioStatesService, Scenarios){return ScenarioStatesService.startPull(_.pluck(Scenarios, 'id'));}
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li>{{project.title}}</li>"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectId",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li>{{project.title}} &gt; Create Scenario</li>"
    })
    .state('Scenario', {
      abstract: true,
      url: "/scenario/:projectId/:scenarioId",
      templateUrl: "views/scenarios.tpl.html",
      controller: "ScenarioCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);},
        'Scenario': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId, $stateParams.scenarioId);},
        'ScenarioAnalysisElements': function(ManageScenariosService, $stateParams){return ManageScenariosService.get($stateParams.scenarioId);},
        'Calculate': function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);}
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li><a goto='dashboard' params='{{project.id}}'>{{project.title}}</a></li><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.edit", {
        url: "/edit/:scenarioElementId",
        views: {
          'editor' : {
            controller: "ScenarioEditorCtrl",
            templateUrl: "views/includes/scenario/editor.tpl.html"
          }
        },
        breadcrumb: "<li><a goto='projects'>All Projects</a></li><li><a goto='dashboard' params='{{project.id}}'>{{project.title}}</a></li><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.results", {
      url: "/results",
      views: {
        'result': {
          controller: "scenarioResultsCtrl",
          templateUrl: "views/includes/scenario/results.tpl.html"
        }
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li><a goto='dashboard' params='{{project.id}}'>{{project.title}}</a></li><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.calculate", {
        url: "/calculate",
        resolve: {
          'Status': function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);},
        },
        views: {
          'calculate': {
            controller: "ScenarioCalculationCtrl",
            templateUrl: "views/includes/scenario/calculate.tpl.html"
          }
        },
        breadcrumb: "<li><a goto='projects'>All Projects</a></li><li><a goto='dashboard' params='{{project.id}}'>{{project.title}}</a></li><li>{{scenario.title || scenario.name}}</li>"
    });
}]);