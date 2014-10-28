"use strict";

angular.module('ThreeSixtyOneView').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/display_manager.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': function(ProjectsService){return ProjectsService.get();}
      },
      breadcrumb: "<span>All Projects</span>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/display_manager.tpl.html",
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
    .state('ScenarioEdit', {
      url: "/scenarioEdit/:projectId/:scenarioId",
      templateUrl: "views/scenario_edit.tpl.html",
      controller: "ScenarioEditCtrl",
      resolve: {
        'Project' : function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);},
        'Scenario': function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId, $stateParams.scenarioId);}
      },
      breadcrumb: "<a goto='projects'>All Projects</a> &gt; <a goto='dashboard' params='{{project.id}}'>{{project.title}}</a> &gt; {{scenario.title}}"
    });
}]);