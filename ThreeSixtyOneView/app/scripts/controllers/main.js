/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "InfoTrayService", "ActiveSelection", "ScenarioService", function($scope,  InfoTrayService, ActiveSelection, ScenarioService) {

        // These are going away
        $scope.InfoTrayService = InfoTrayService;
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
    }]).controller("ProjectDashboardCtrl", ["$scope",  "$stateParams", "$state", "CONFIG", "InfoTrayService", "ProjectsService", "Projects", "Scenarios", "ActiveSelection", "SortAndFilterService", "GotoService", "EVENTS", function($scope,  $stateParams, $state, CONFIG, InfoTrayService, ProjectsService, Projects, Scenarios, ActiveSelection, SortAndFilterService, GotoService, EVENTS) {
        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            getProject = function(){
                return $scope.project;
            },
            init = function(whichView){
                console.info(whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                $scope.project = ProjectsService.getProjectItemById($stateParams.projectId);
                $scope.hasAlerts = Scenarios.data.length < 1 ? $scope.CONFIG.alertSrc : false;

                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                ProjectsService.setProjects(Projects.data);

                $scope.data = Scenarios.data;
                SortAndFilterService.init({
                    data: Scenarios,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                });
            };

        init($state.current.name);

        // Controller API
        $scope.goto = function(evt, where, item){
            evt.stopPropagation();
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit(getProject().id, item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.id); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoScenarioCreate": GotoService.scenarioCreate(item.id); break;
            }
            InfoTrayService.closeInfoTray();
        };

        $scope.showDetails = function(item){
            ActiveSelection.setActiveItem(item);
            InfoTrayService.toggleInfoTray();
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

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function (event){
            $scope.goto(event, "gotoScenarioCreate",  $scope.project);
        });

        $scope.$on(EVENTS.gotoDashboard, function (event, data){
            $scope.goto(event, "gotoDashboard",  data.title);
        });
    }]).controller("ProjectListingCtrl", ["$scope",  "$stateParams", "$state", "CONFIG", "Favorites", "FavoritesService", "InfoTrayService", "ProjectsService", "Projects", "ActiveSelection", "SortAndFilterService", "GotoService", "EVENTS", function($scope, $stateParams, $state, CONFIG, Favorites, FavoritesService, InfoTrayService, ProjectsService, Projects, ActiveSelection, SortAndFilterService, GotoService, EVENTS) {
        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            master,
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            getProject = function(){
                return ActiveSelection.getActiveItem();
            },
            init = function(whichView){
                console.info("initing " + whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                
                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                ProjectsService.setProjects(Projects.data);

                $scope.data = Projects.data;
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
        $scope.goto = function(evt, where, item){
            evt.stopPropagation();
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit(getProject().id, item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.id); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoScenarioCreate": GotoService.scenarioCreate(item.id); break;
            }
            InfoTrayService.closeInfoTray();
        };

        $scope.showDetails = function(item){
            ActiveSelection.setActiveItem(item);
            InfoTrayService.toggleInfoTray();
        };

        $scope.toggleFavorite = function($event, itemID){
            $event.stopPropagation();
            FavoritesService.toggleFavorite(itemID);
            SortAndFilterService.filter();
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
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

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function (event){
            $scope.goto(event, "gotoScenarioCreate",  $scope.CONFIG.projectName);
        });

        $scope.$on(EVENTS.gotoDashboard, function (event, data){
            $scope.goto(event, "gotoDashboard",  data.title);
        });
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
    }]).controller("ScenarioEditCtrl", ["$scope",  "$stateParams", "GotoService", "ProjectsService", "ScenarioModel", function($scope, $stateParams, GotoService, ProjectsService, ScenarioModel) {
        $scope.GotoService = GotoService;
        $scope.project = ProjectsService.getProjectItemById($stateParams.projectId);
        $scope.scenario = ScenarioModel.getScenarioById($stateParams.scenarioId);
        console.info($scope.scenario);
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];
    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "ScenarioService", "DiaglogService", "GotoService", "Project", "Scenarios", function($scope, $stateParams, ScenarioService, DiaglogService, GotoService, Project, Scenarios){
            $scope.GotoService = GotoService;
            $scope.project = Project;
            $scope.scenarios = Scenarios.data;

            $scope.createScenario = function(scenario){
                ScenarioService.create(scenario).then(function(data){
                    GotoService.scenarioEdit(scenario.projectName, scenario.title);
                });
            };

            $scope.isScenarioTitleUnique = function(scenarioTitle) {
                return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
            };

            $scope.currentScenario = function (scenario){
                DiaglogService.currentScenario(scenario);
            };
    }]);