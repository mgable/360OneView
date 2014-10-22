/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "ActiveSelection", "CubeService", function($scope,  ActiveSelection, CubeService) {

        // These are going away
        $scope.ActiveSelection = ActiveSelection;
        CubeService.getMeta(1).then(function(response){
            // console.info("from main");
            // console.info(response);
        });

        CubeService.getMembers(1).then(function(response){
            // console.info("from main");
            // console.info(response);
        });

        CubeService.getViewByMembers(1,1,1).then(function(response){
            // console.info("from main");
            // console.info(response);
        });


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
    }]).controller("NavigationCtrl", ["$scope", "$state", "$compile", "ScenarioService", "ProjectsService", "GotoService", "$stateParams", function($scope, $state, $compile, ScenarioService, ProjectsService, GotoService, $stateParams){

       
    }]).controller('InfoTrayCtrl', ["$scope", "$state", "CONFIG", "ActiveSelection", "FavoritesService", "SortAndFilterService", "EVENTS", function($scope, $state, CONFIG, ActiveSelection, FavoritesService, SortAndFilterService, EVENTS) {


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
            if (response) {
                $scope.selectedItem = response;
            }
        });
    }]).controller("ProjectDashboardCtrl", ["$scope", "$controller", "$stateParams", "$state", "CONFIG", "ProjectsService", "Project", "Scenarios", "ActiveSelection", "SortAndFilterService", "GotoService", "ScenarioService", "EVENTS", function($scope,  $controller, $stateParams, $state, CONFIG, ProjectsService, Project, Scenarios, ActiveSelection, SortAndFilterService, GotoService, ScenarioService,EVENTS) {

        angular.extend(this, $controller('ProjectsViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService}));

        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            getScenarios = function(id){
                return ScenarioService.get(id);
            },
            init = function(whichView){
                console.info(whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                $scope.project = Project;

                $scope.hasAlerts = Scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;

                _.extend($scope.CONFIG, $stateParams);

                // // add projects to the projects service
                // ProjectsService.setProjects(Projects);

                $scope.data = Scenarios;
                SortAndFilterService.init({
                    data: Scenarios,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                });

                $scope.selectItem(SortAndFilterService.getData()[0], getScenarios);
            };
        
        $scope.selectItem = function(item){
            // change this to getDetails when entities are finished
            $scope.showDetails(item, getScenarios, "scenarios");
        };

        $scope.getProject = function(){
            return $scope.project;
        };

        $scope.$on(EVENTS.gotoScenarioCreate, function(evt, data){
            $scope.goto(evt, 'gotoScenarioCreate', $scope.getProject());
        });

        init($state.current.name);
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "$stateParams", "$state", "CONFIG", "Favorites", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "ActiveSelection", "SortAndFilterService", "GotoService", "DiaglogService", "EVENTS", function($scope, $controller, $stateParams, $state, CONFIG, Favorites, FavoritesService, ProjectsService, ScenarioService, Projects, ActiveSelection, SortAndFilterService, GotoService, DiaglogService, EVENTS) {

        angular.extend(this, $controller('ProjectsViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService, ScenarioService:ScenarioService }));

        var currentView = CONFIG.view[$state.current.name],
            filter = "",
            master,
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            getScenarios = function(id){
                return ScenarioService.get(id);
            },
            init = function(whichView){
                console.info("initing " + whichView);
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                
                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                // ProjectsService.setProjects(Projects);

                $scope.data = Projects;

                SortAndFilterService.init({
                    data: Projects,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                });

                // the master project is always a favorite and not in the favorite REST call (yet)
                master = _.find($scope.data, function(elem){return elem.isMaster;});
                
                // get all favorites
                FavoritesService.setFavorites(_.pluck(Favorites, 'uuid'));
                if (master) { FavoritesService.addFavorite(master.id); }

                // select first time in list
                $scope.selectItem(SortAndFilterService.getData()[0], getScenarios);
            };

        // Controller API
        $scope.selectItem = function(item){
            $scope.getDetails(item, getScenarios, "scenarios");
        };

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

        $scope.$on(EVENTS.createProject, function(evt, data){
            DiaglogService.create('project');
        });

        init($state.current.name);
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

        $scope.getDetails = function(item, from, what){
            // $scope.selectedItem = item;
            from(item.id).then(function(response){
                // $scope.selectedItem.scenarios = response;
                item[what] = response;
                //$scope.showDetails($scope.selectedItem);
                $scope.showDetails(item);
            });
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
    }]).controller("ScenarioEditCtrl", ["$scope",  "$stateParams", "GotoService", "ProjectsService", "ScenarioService", "Project", "Scenario", 'ptData', function($scope, $stateParams, GotoService, ProjectsService, ScenarioService, Project, Scenario, ptData) {
        $scope.GotoService = GotoService;
        $scope.project = Project;
        $scope.scenario = Scenario;

        $scope.pivotTableData = ptData.data;
        // $scope.pivotTableHeaders = ptData.headers;
        $scope.spread = {sheet: {}};

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
                $scope.scenario.referenceScenario.name = data.title;
            });
    }]);