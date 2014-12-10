"use strict";

angular.module('ThreeSixtyOneView.config').config(["$stateProvider", "$urlRouterProvider", "CONFIG", function($stateProvider, $urlRouterProvider, CONFIG) {

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
      breadcrumb: "<span>All Projects</span>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/projects.tpl.html",
      controller: "ScenarioListingCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);},
        'Favorites': function(FavoritesService, $stateParams){return FavoritesService.getFavoritesScenarios($stateParams.projectId);}
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; {{project.title}}"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectId",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; {{project.title}} &gt; Create Scenario"
    })
    .state('Scenario', {
      abstract: true,
      url: "/scenario/:projectId/:scenarioId",
      templateUrl: "views/scenario.tpl.html",
      controller: "ScenarioCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenario': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId, $stateParams.scenarioId);},
        'Views': function(PivotViewService){return PivotViewService.getViewsAndDefault();},
        'ScenarioElements': function(ScenarioElementService, $stateParams){return ScenarioElementService.get($stateParams.scenarioId);}

      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"
    })
    .state("Scenario.edit", {
        url: "/edit",
        views: {
          'builder': {
            controller: "PivotBuilderCtrl",
            templateUrl: "views/includes/pivot_table_builder.tpl.html",
          },
          'export': {
            controller: "exportCtrl",
            templateUrl: "views/includes/pivot_table_export.tpl.html",
          },
          'table': {
            controller: "pivotTableCtrl",
            templateUrl: "views/includes/pivot_table.tpl.html",
          }
        },
        breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"
    })
    .state("Scenario.results", {
      url: "/results",
      views: {
        'results': {
          templateUrl: "views/includes/scenario_results.tpl.html"
        }
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"
    });
}]);