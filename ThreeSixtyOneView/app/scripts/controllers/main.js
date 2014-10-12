/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "ViewService", "InfoTrayService", "ActiveSelection", "ScenarioService", function($scope, ViewService, InfoTrayService, ActiveSelection, ScenarioService) {
        $scope.ViewService = ViewService;

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

    }]).controller("ManagerCtrl", ["$scope", "$injector",  "$stateParams", "$state", "CONFIG", "FavoritesModel", "FavoritesService", "ViewService", "InfoTrayService", "ProjectsService", "Projects", "ActiveSelection", "SortAndFilterService", "GotoService", "EVENTS", function($scope, $injector, $stateParams, $state, CONFIG, FavoritesModel, FavoritesService, ViewService, InfoTrayService, ProjectsService, Projects, ActiveSelection, SortAndFilterService, GotoService, EVENTS) {
        var currentView = CONFIG.view[$state.current.name],
            currentModel = currentView.model, filter = "",
            viewModel,
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            getProjectName = function(){
                return ActiveSelection.activeItem() ? ActiveSelection.getActiveItem().title : $scope.CONFIG.projectName;
            },
            init = function(){
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                _.extend($scope.CONFIG, $stateParams);

                // add projects to the projects service
                ProjectsService.setProjects(Projects.data);

                // detemine which view model to get
                if (currentModel){
                    viewModel = $injector.get(currentModel);
                }

                // if there is a view model get the associated data and send it to the filter service
                if (viewModel) {
                    viewModel.get($scope.CONFIG.projectName).then(function(response) {
                        $scope.data = response;
                        SortAndFilterService.init({
                            data: response,
                            orderBy: orderBy,
                            filter: filter,
                            reverse: reverse
                        });

                        // if view has favorites get favorite data
                        if ($scope.CONFIG.hasFavorites) {
                            // the master project is always a favorite and not in the favorite REST call (yet)
                            var master;
                            _.each($scope.data, function(element){
                               master = _.find(element, function(elem){return elem.isMaster;});
                            });

                            // get all favorites
                            FavoritesModel.get().then(function(response){
                                FavoritesService.setFavorites(_.pluck(response, 'uuid'));
                                if (master) { FavoritesService.addFavorite(master.id); }
                            });
                        }
                    });
                    //ViewService.setCurrentView($state.current.name);
                    ViewService.setModel(viewModel);
                } else {
                    console.info ("no view model");
                }
            };

        init();

        // Controller API
        $scope.goto = function(evt, where, item){
            //evt.stopPropagation();
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit(getProjectName(), item); break;
                case "gotoDashboard": GotoService.dashboard(item); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoScenarioCreate": GotoService.scenarioCreate(item); break;
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

        $scope.$on(EVENTS.updateProjects, function (event, data){
            console.info(data)
            $scope.goto(event, "gotoDashboard",  data.item.title);
        });

    }]).controller('InfoTrayCtrl', ["$scope", "$state", "CONFIG", "ViewService", "ScenarioService", "ActiveSelection", "FavoritesService", "SortAndFilterService", "EVENTS", function($scope, $state, CONFIG, ViewService, ScenarioService, ActiveSelection, FavoritesService, SortAndFilterService, EVENTS) {
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
            var service = ViewService.getModel();
            service.rename(item);
        };

        $scope.$on(EVENTS.changeActiveItem, function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }

            // TODO: refactor this out once entities are finished
            if(ViewService.getCurrentView () === "ProjectManager") {
                getScenarios($scope.selectedItem.title).then(function(response){
                    $scope.selectedItem.scenarios = response.data;
                });
            }
        });
    }]).controller("ScenarioEditCtrl", ["$scope", "$state",  "$stateParams", "GotoService", function($scope, $state, $stateParams, GotoService) {
        $scope.GotoService = GotoService;
        $scope.projectName = $stateParams.project;
        $scope.entity = $stateParams.entity;
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];

    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "ScenarioService", "DiaglogService", "GotoService", function($scope, $stateParams, ScenarioService, DiaglogService, GotoService){
            $scope.GotoService = GotoService;
            $scope.scenario = {
                project: $stateParams.projectName
            };

            $scope.createScenario = function(scenario){
                ScenarioService.create(scenario).then(function(data){
                    GotoService.scenarioEdit(scenario.project, scenario.title);
                });
            };

            $scope.currentScenario = function (scenario){
                DiaglogService.currentScenario(scenario);
            };
    }]);