/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$state", "$scope", "ViewService", "InfoTrayService", "ActiveSelection", "ScenarioService", function($state, $scope, ViewService, InfoTrayService, ActiveSelection, ScenarioService) {
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

        $scope.gotoScenarioEdit = function (project, scenario){
            $state.go("ScenarioEdit", {"project": project, "scenario": scenario});
        };

        $scope.gotoDashboard = function(project){
            $state.go("Dashboard", {"projectName": project});
        };

        $scope.gotoProjects = function(){
            $state.go("ProjectManager");
        };
            
        $scope.gotoScenarioCreate = function(projectName){
            $state.go("ScenarioCreate", {"projectName": projectName});
        };

    }]).controller("ManagerCtrl", ["$scope", "$injector", "$location", "$stateParams", "$state", "CONFIG", "FavoritesModel", "FavoritesService", "ViewService", "InfoTrayService", "ProjectsService", "Projects", "ActiveSelection", "SortAndFilterService", function($scope, $injector, $location, $stateParams, $state, CONFIG, FavoritesModel, FavoritesService, ViewService, InfoTrayService, ProjectsService, Projects, ActiveSelection, SortAndFilterService) {
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
        $scope.SortAndFilterService = SortAndFilterService;

        $scope.goto = function(evt, where, item){
            //evt.stopPropagation();
            switch(where){
                case "gotoScenarioEdit": $scope.gotoScenarioEdit(getProjectName(), item); break;
                case "gotoDashboard": $scope.gotoDashboard(item); break;
                case "gotoProjects": $scope.gotoProjects(); break;
                case "gotoScenarioCreate": $scope.gotoScenarioCreate(item); break;
            }
            InfoTrayService.closeInfoTray();
        };

        // Event Listeners
        $scope.$on("scenario:create", function (event){
            $scope.goto(event, "gotoScenarioCreate",  $scope.CONFIG.projectName);
        });

        $scope.$on("ProjectsModel:create", function (event, data){
            $scope.goto(event, "gotoDashboard",  data.title);
        });

    }]).controller('InfoTrayCtrl', ["$scope", "ViewService", "ScenarioService", "ActiveSelection", function($scope, ViewService, ScenarioService, ActiveSelection) {
        var getScenarios = function(title){
            return ScenarioService.get(title);
        };

        $scope.selectedItem = ActiveSelection.getActiveItem();

        $scope.update = function(item) {
            var service = ViewService.getModel();
            service.rename(item);
        };

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
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
    }]).controller("ScenarioEditCtrl", ["$scope", "$state",  "$stateParams", function($scope, $state, $stateParams) {
        $scope.projectName = $stateParams.project;
        $scope.entity = $stateParams.entity;
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];

    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "$state", "ScenarioService", function($scope, $stateParams, $state, ScenarioService){
        $scope.scenario = {
            project: $stateParams.projectName
        };

        $scope.createScenario = function(scenario){
            ScenarioService.create(scenario);
            $scope.gotoScenarioEdit(scenario.project, scenario.title);
        };
    }]);