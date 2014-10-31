"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/projects.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsService){return ProjectsService.get();}
      },
      breadcrumb: "<span>All Projects</span>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/projects.tpl.html",
      controller: "ProjectDashboardCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenarios': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}
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
      url: "/scenario/:projectId/:scenarioId",
      templateUrl: "views/scenario.tpl.html",
      controller: "ScenarioCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenario': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId, $stateParams.scenarioId);},
        'Views': function(PivotViewService){return PivotViewService.getViewsAndDefault(1);}
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"
    })
    .state("Scenario.edit", {
        views: {
          'builder': {
            controller: "PivotBuilderCtrl",
            templateUrl: "views/includes/pivot_table_builder.tpl.html",
          },
          'table': {
            controller: "spreadjsCtrl",
            templateUrl: "views/includes/spreadjs.tpl.html",
          }
        },
        breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"

    })
    .state("Scenario.results", {
      views: {
        results: {
          templateUrl: "views/includes/scenario_results.tpl.html"
        }
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"

    });
}]);