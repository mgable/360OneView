'use strict';

angular.module('ThreeSixtyOneView.services', ['dialogs.main', 'ThreeSixtyOneView.filters']);
angular.module('ThreeSixtyOneView.directives', ['ThreeSixtyOneView.services']);
angular.module('ThreeSixtyOneView.filters', []);
angular.module('ThreeSixtyOneView.config',[]);

angular.module('ThreeSixtyOneView', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    // 'pasvaz.bindonce',
    // 'LocalStorageModule',
    'dialogs.main',
    'ThreeSixtyOneView.directives',
    'ThreeSixtyOneView.services',
    'ThreeSixtyOneView.config'
])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/display_manager.tpl.html',
                controller: 'ManagerCtrl',
                viewName: "ProjectManager"
            })
            .when('/scenarioEdit/:project/:scenario', {
                templateUrl: 'views/scenario_edit.tpl.html',
                controller: 'ScenarioEditCtrl'
            })
            .when('/scenarioCreate/:projectName', {
                templateUrl: 'views/scenario_create.tpl.html',
                controller: 'ScenarioCreateCtrl'
            })
            .when('/projects', {
                templateUrl: 'views/display_manager.tpl.html',
                controller: 'ManagerCtrl',
                viewName: "ProjectManager"
            })
            .when('/dashboard/:projectName', {
                templateUrl: 'views/display_manager.tpl.html',
                controller: 'ManagerCtrl',
                viewName: "Dashboard"
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function() {
        String.prototype.bool = function() {
            return (/^true$/i).test(this);
        };
    })
    .run(function($location, SERVER){
        console.info($location.host());
        console.info(SERVER[$location.host()]);
    })
    .run(["FavoritesModel", "ProjectsModel", function(FavoritesModel, ProjectsModel) {
        //FilesModel.$find();
        ProjectsModel.find();
        FavoritesModel.find();
        //localStorageService.set('managerSettings', 'foobar')
    }]);