"use strict";

angular.module('ThreeSixtyOneView.config').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('Playground', {
      url: "/playground",
      templateUrl: "views/includes/create_recommendation/drawer/select.tpl.html",
      // templateUrl: "playground/views/playground.tpl.html",
      // controller: "PlaygroundCtrl",
      breadcrumb: "<li class='single'>Playground</li>"
    })
    .state('CreateRecommendation', {
      url: "/createrecommendation/:projectId",
      templateUrl: "views/create_recommendation.tpl.html",
      controller: "CreateRecommendationCtrl",
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    }).
    state('CreateRecommendation.base',{
      views: {
        'recommend': {
          templateUrl:"views/includes/create_recommendation/drawer/choose.tpl.html",
          controller: 'ChooseBaseScenarioCtrl'
        },
      },
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    })
    .state('CreateRecommendation.assumptions',{
      views: {
        'recommend': {
          templateUrl:"views/includes/create_recommendation/drawer/assumptions.tpl.html"
        }
      },
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    })
    .state('ScenarioTemplates', {
      url: "/scenariotemplates/:type",
      templateUrl: "views/scenario_templates.tpl.html",
      controller: "ScenarioTemplatesCtrl",
      breadcrumb: "<li class='single'>Scenario Templates</li>"
    })
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/projects.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsService){return ProjectsService.get();},
        'Favorites': function(FavoritesService){return FavoritesService.get("project");}
      },
      breadcrumb: "<li class='single'>All Projects</li>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/projects.tpl.html",
      controller: "ScenarioListingCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);},
        'Favorites': function(FavoritesService, $stateParams){return FavoritesService.getFavoritesScenarios($stateParams.projectId);},
      },
      breadcrumb: "<li class='parent'><a goto='projects'>All Projects</a></li><br><li>{{project.name}}</li>"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectId",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li>{{project.name}} &gt; Create Scenario</li>"
    })
    .state('Scenario', {
      abstract: true,
      url: "/scenario/:projectId/:scenarioId",
      templateUrl: "views/scenarios.tpl.html",
      controller: "ScenarioCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);},
        'Scenario': function(ScenarioService, Scenarios, $stateParams){return ScenarioService.find(Scenarios, $stateParams.scenarioId);},
        'ScenarioAnalysisElements': function(ManageScenariosService, $stateParams){return ManageScenariosService.get($stateParams.scenarioId);},
        'Calculate': function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);}
      },
      breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.edit", {
        url: "/edit/:scenarioElementId",
        views: {
          'editor' : {
            controller: "ScenarioEditorCtrl",
            templateUrl: "views/includes/scenario/editor.tpl.html"
          }
        },
        breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.results", {
      url: "/results",
      views: {
        'result': {
          controller: "scenarioResultsCtrl",
          templateUrl: "views/includes/scenario/results.tpl.html"
        }
      },
      breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.calculate", {
        url: "/calculate",
        resolve: {
          'Status': function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);},
          'SubmitCalculate': function(AnalyticCalculationsService, $stateParams, Status) {return AnalyticCalculationsService.startCalculation(Status, $stateParams.scenarioId);}
        },
        views: {
          'calculate': {
            controller: "ScenarioCalculationCtrl",
            templateUrl: "views/includes/scenario/calculate.tpl.html"
          }
        },
        breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    });
}]);