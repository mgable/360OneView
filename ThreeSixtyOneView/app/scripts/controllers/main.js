/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "ActiveSelection", function($scope,  ActiveSelection) {

        // These are going away
        $scope.ActiveSelection = ActiveSelection;

        // convenience methods
        $scope.console = function(msg) {
            console.info(msg);
        };

        $scope.alert = function(msg, evt) {
            window.alert(msg);
            if (evt){
                evt.stopPropagation();
            }
        };
    }]).controller("NavigationCtrl", ["$scope", "$state", "$interpolate", "ProjectsService", "$stateParams", function($scope, $state, $interpolate, ProjectsService, $stateParams){

        $scope.$on("$stateChangeSuccess", function(){
            $scope.project = $stateParams.projectId ? ProjectsService.getProjectItemById($stateParams.projectId) : "";
            $scope.breadcrumbs = $interpolate($state.current.breadcrumb)($scope.project);
        });
    }]).controller("ProjectDashboardCtrl", ["$scope", "$controller", "$stateParams", "$state", "CONFIG", "ProjectsService", "Projects", "Scenarios", "ActiveSelection", "SortAndFilterService", "GotoService", "EVENTS", function($scope,  $controller, $stateParams, $state, CONFIG, ProjectsService, Projects, Scenarios, ActiveSelection, SortAndFilterService, GotoService, EVENTS) {

        angular.extend(this, $controller('ProjectsViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService}));

        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            init = function(whichView){
                console.info(whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                $scope.project = ProjectsService.getProjectItemById($stateParams.projectId);
                $scope.hasAlerts = Scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;

                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                ProjectsService.setProjects(Projects);

                $scope.data = Scenarios;
                SortAndFilterService.init({
                    data: Scenarios,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                });
            };

        init($state.current.name);

        $scope.getProject = function(){
            return $scope.project;
        };

    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "$stateParams", "$state", "CONFIG", "Favorites", "FavoritesService", "ProjectsService", "Projects", "ActiveSelection", "SortAndFilterService", "GotoService", "EVENTS", function($scope, $controller, $stateParams, $state, CONFIG, Favorites, FavoritesService, ProjectsService, Projects, ActiveSelection, SortAndFilterService, GotoService, EVENTS) {

        angular.extend(this, $controller('ProjectsViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService }));

        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            master,
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            init = function(whichView){
                console.info("initing " + whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                
                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                ProjectsService.setProjects(Projects);

                $scope.data = Projects;
                SortAndFilterService.init({
                    data: Projects,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                });

                // the master project is always a favorite and not in the favorite REST call (yet)
                _.each($scope.data, function(element){
                   master = _.find(element, function(elem){return elem.isMaster;});
                });

                // get all favorites
                FavoritesService.setFavorites(_.pluck(Favorites, 'uuid'));
                if (master) { FavoritesService.addFavorite(master.id); }
            };

        init($state.current.name);

        // Controller API
        $scope.toggleFavorite = function($event, itemID){
            $event.stopPropagation();
            FavoritesService.toggleFavorite(itemID);
            SortAndFilterService.filter();
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        $scope.getProject = function(){
            return ActiveSelection.getActiveItem();
        };
    }]).controller("ProjectsViewCtrl", ["$scope", "ActiveSelection", "SortAndFilterService", "GotoService",function($scope, ActiveSelection, SortAndFilterService, GotoService){
        $scope.goto = function(evt, where, item){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit($scope.getProject().id, item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.id); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoScenarioCreate": GotoService.scenarioCreate(item.id); break;
            }
        };

        $scope.showDetails = function(item){
            ActiveSelection.setActiveItem(item);
        };

        $scope.isActiveItem = function (item){
            return ActiveSelection.isActiveItem(item);
        };

        $scope.getData = function () {
            return SortAndFilterService.getData();
        };

        $scope.getSorter = function(column) {
            return SortAndFilterService.getSorter(column);
        };

        $scope.getSelectedLabel = function() {
            return SortAndFilterService.getSelectedLabel();
        };

        $scope.getCount = function() {
            return SortAndFilterService.getCount();
        };

        $scope.setFilter = function(type, item, forceFilter) {
            SortAndFilterService.setFilter(type, item, forceFilter);
        };
    }]).controller('InfoTrayCtrl', ["$scope", "$state", "CONFIG", "ScenarioService", "ActiveSelection", "FavoritesService", "SortAndFilterService", "EVENTS", function($scope, $state, CONFIG, ScenarioService, ActiveSelection, FavoritesService, SortAndFilterService, EVENTS) {
        var getScenarios = function(title){
            return ScenarioService.get(title);
        };

        $scope.hasFavorites = CONFIG.view[$state.current.name].hasFavorites;
        $scope.selectedItem = ActiveSelection.getActiveItem();

        $scope.toggleFavorite = function(itemID){
            FavoritesService.toggleFavorite(itemID);
            SortAndFilterService.filter();
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        $scope.update = function(item) {
            $scope.$broadcast(EVENTS.renameProject, item);
        };

        $scope.$on(EVENTS.changeActiveItem, function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }

            // TODO: refactor this out once entities are finished
            if($state.current.name === "ProjectManager") {
                getScenarios($scope.selectedItem.title).then(function(response){
                    $scope.selectedItem.scenarios = response.data;
                });
            }
        });
    }]).controller("ScenarioEditCtrl", ["$scope",  "$stateParams", "GotoService", "ProjectsService", "ScenarioService", function($scope, $stateParams, GotoService, ProjectsService, ScenarioService) {
        $scope.GotoService = GotoService;
        $scope.project = ProjectsService.getProjectItemById($stateParams.projectId);
        $scope.scenario = ScenarioService.getScenarioById($stateParams.scenarioId);

        //TODO: temp data
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];
    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "ScenarioService", "DiaglogService", "GotoService", "Project", "Scenarios", "EVENTS", "CONFIG", function($scope, $stateParams, ScenarioService, DiaglogService, GotoService, Project, Scenarios, EVENTS, CONFIG){
            var getBaseScenario = function(){
                return angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
            };

            $scope.GotoService = GotoService;
            $scope.project = Project;
            $scope.scenario = getBaseScenario();
            $scope.scenarios = Scenarios.data;

            $scope.createScenario = function(_scenario_){
                ScenarioService.create($scope.project, _scenario_).then(function(response){
                    GotoService.scenarioEdit($scope.project.id, response.id);
                });
            };

            $scope.isScenarioTitleUnique = function(scenarioTitle) {
                return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
            };


            $scope.currentScenario = function (scenario){
                DiaglogService.currentScenario($scope.project, scenario);
            };

            $scope.$on(EVENTS.updateBaseScenario, function(event, data){
                $scope.scenario.referenceScenario.id = data.id;
                $scope.scenario.referenceScenario.title = data.title;
            });
    }]);