/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
    .controller("MainCtrl", ["$scope", "$location", "ErrorService", function($scope, $location, ErrorService) {
        // Error service surfaced here

        // querystring 'e2e' formats data for protractor tests
        if ($location.search().e2e === "true"){
            $scope.e2e = true;
        }

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
    }]).controller("NavigationCtrl", ["$scope", function($scope){
    }]).controller('InfoTrayCtrl', ["$scope", "$rootScope", "$state", "CONFIG", "ActiveSelection", "EVENTS", "DialogService", function($scope, $rootScope, $state, CONFIG, ActiveSelection, EVENTS, DialogService) {
        $scope.selectedItem = ActiveSelection.getActiveItem();
        $scope.showScenario = false;
        $scope.viewAll = 'View All';
        $scope.trayActions = CONFIG.view[$state.current.name].trayActions;
        $scope.ActiveSelection = ActiveSelection;

        $scope.action = function(action, data){
            if(action){
                $rootScope.$broadcast(EVENTS[action], action, data);
            }
        };

        $scope.toggleShowScenarios = function() {
            $scope.showScenario = !$scope.showScenario;
            $scope.viewAll = ($scope.showScenario) ? 'View Less' : 'View All';
        };

        $scope.$on(EVENTS.trayCopy, function(evt, action, data){
            if (data){
                DialogService[action](data);
            } else {
                DialogService.notify("ERROR: no scenarios", "There are no scenarios to copy.");
            }
        });

        $scope.$on(EVENTS.changeActiveItem, function(event, response) {
            if (response) {
                $scope.selectedItem = response;
            }
        });

        $scope.$on(EVENTS.noop, function(event, action){
            DialogService[action]("Functionality TBD", "The functionality of this control is TDB");
        });
    }]).controller("ProjectDashboardCtrl", ["$scope", "$controller", "$stateParams", "$state", "CONFIG", "ProjectsService", "Project", "Scenarios", "ActiveSelection", "SortAndFilterService", "GotoService", "ScenarioService", "EVENTS", "FavoritesService", "Favorites", function($scope,  $controller, $stateParams, $state, CONFIG, ProjectsService, Project, Scenarios, ActiveSelection, SortAndFilterService, GotoService, ScenarioService, EVENTS, FavoritesService, Favorites) {

        angular.extend(this, $controller('ProjectViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService, CONFIG:CONFIG, FavoritesService:FavoritesService}));

        var localInit = function(){
            $scope.project = Project;
            $scope.hasAlerts = Scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;
        };

        $scope.selectItem = function(item){
            $scope.showDetails(item);
        };

        $scope.getProject = function(){
            return $scope.project;
        };

        $scope.$on(EVENTS.gotoScenarioCreate, function(evt, data){
            $scope.goto(evt, 'gotoScenarioCreate', $scope.getProject());
        });

        $scope.$on(EVENTS.copyScenario, function(evt, scenario){
            scenario.description = scenario.description || "";
            ScenarioService.create($scope.getProject(), scenario).then(function(response){
                $scope.goto(evt, 'gotoScenarioEdit', response);
            });
        });

        $scope.$on(EVENTS.renameScenario, function(evt, data){
            ScenarioService.rename(data, $scope.getProject().id);
        });

        $scope.init($state.current.name, Scenarios, $stateParams);
        localInit();
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "$stateParams", "$state", "CONFIG", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "ActiveSelection", "SortAndFilterService", "GotoService", "DialogService", "EVENTS", function($scope, $controller, $stateParams, $state, CONFIG, FavoritesService, ProjectsService, ScenarioService, Projects, ActiveSelection, SortAndFilterService, GotoService, DialogService, EVENTS) {

        angular.extend(this, $controller('ProjectViewCtrl', {$scope: $scope, SortAndFilterService: SortAndFilterService, ActiveSelection: ActiveSelection, GotoService:GotoService, ScenarioService:ScenarioService, CONFIG:CONFIG, FavoritesService:FavoritesService }));

        var localInit = function(){
            // the master project is always a favorite and not in the favorite REST call (yet)
            var master = _.find(Projects, function(elem){return elem.isMaster;});
            if (master) { FavoritesService.addFavorite(master.id, $scope.CONFIG.favoriteType); }
        };

        // Controller API
        $scope.selectItem = function(item){
            $scope.getDetails(item, $scope.getScenarios, "scenarios");
        };

        $scope.getScenarios = function(id){
            return ScenarioService.get(id);
        };

        $scope.getProject = function(){
            return ActiveSelection.getActiveItem();
        };

        $scope.$on(EVENTS.openCreateProject, function(evt, data){
            DialogService.create();
        });

        $scope.$on(EVENTS.createProject, function(evt, project){
            ProjectsService.create(project).then(function(response){
                GotoService.dashboard(response.id);
            });
        });

        $scope.init($state.current.name, Projects, $stateParams);
        localInit();
    }]).controller("ProjectViewCtrl", ["$scope", "ActiveSelection", "SortAndFilterService", "GotoService", "CONFIG", "FavoritesService", function($scope, ActiveSelection, SortAndFilterService, GotoService, CONFIG, FavoritesService){

        $scope.FavoritesService = FavoritesService;
        
        $scope.init = function(whichView, _data_, stateParams){
            var currentView = CONFIG.view[whichView],
            filter = currentView.filterMenu.items[0],
            reverse = currentView.reverse,
            orderBy = currentView.orderBy;

            $scope.CONFIG = currentView;
            $scope.data = _data_;

            _.extend($scope.CONFIG, stateParams);

            SortAndFilterService.init({
                data: _data_,
                orderBy: orderBy,
                filter: filter,
                reverse: reverse
            });

            // select first time in list
            $scope.selectItem(SortAndFilterService.getData()[0]);
        };

        $scope.goto = function(evt, where, item){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit($scope.getProject().id, item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.id); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoScenarioCreate": GotoService.scenarioCreate(item.id); break;
            }
        };

        $scope.getDetails = function(item, model, what){
            model(item.id).then(function(response){
                item[what] = response;
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

        $scope.toggleFavorite = function($event, itemID){
            $event.stopPropagation();
            FavoritesService.toggleFavorite(itemID, $scope.CONFIG.favoriteType);
            SortAndFilterService.filter();
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

    }]).controller("ScenarioCtrl", ["$scope",  "$stateParams", "GotoService", "ProjectsService", "ScenarioService", "Project", "Scenario", "ScenarioElements", 'ptData', function($scope, $stateParams, GotoService, ProjectsService, ScenarioService, Project, Scenario, ScenarioElements, ptData) {

        $scope.GotoService = GotoService;
        $scope.project = Project;
        $scope.scenario = Scenario;

        $scope.pivotTableData = ptData.data;
        // $scope.pivotTableHeaders = ptData.headers;
        $scope.spread = {sheet: {}};

        //TODO: temp data
        $scope.types =  ScenarioElements;
        $scope.scenarioElementType = $scope.types[0];
    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "ScenarioService", "DialogService", "GotoService", "Project", "Scenarios", "EVENTS", "CONFIG", function($scope, $stateParams, ScenarioService, DialogService, GotoService, Project, Scenarios, EVENTS, CONFIG){
            var getBaseScenario = function(){
                return angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
            };

            $scope.GotoService = GotoService;
            $scope.project = Project;
            $scope.scenario = getBaseScenario();
            $scope.scenarios = Scenarios;

            $scope.createScenario = function(_scenario_){
                ScenarioService.create($scope.project, _scenario_).then(function(response){
                    GotoService.scenarioEdit($scope.project.id, response.id);
                });
            };

            $scope.isScenarioTitleUnique = function(scenarioTitle) {
                return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
            };


            $scope.currentScenario = function (scenario){
                DialogService.currentScenario($scope.project, scenario);
            };

            $scope.$on(EVENTS.updateBaseScenario, function(event, data){
                $scope.scenario.referenceScenario.id = data.id;
                $scope.scenario.referenceScenario.name = data.title;
            });
    }]);