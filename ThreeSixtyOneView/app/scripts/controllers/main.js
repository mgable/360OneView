'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "SortAndFilterService", "FileDeleteService", "ActiveSelection", "InfoTrayService", "DiaglogService", "FavoritesService", "ViewService", "Urlmaker", function($scope, SortAndFilterService, FileDeleteService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService, Urlmaker) {
        // make all services available to app
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;
        $scope.FavoritesService = FavoritesService;
        $scope.ViewService = ViewService;
        $scope.Urlmaker = Urlmaker;
        // for testing only
        $scope.foo = "foobar!!!!";

        //localStorageService.set("foo", "bar");

        //console.info(localStorageService.get("foo"))

        // convenience methods
        $scope.console = function(msg) {
            console.info(msg);
        }

        $scope.alert = function(msg, evt) {
            alert(msg);
            if (evt){
                evt.stopPropagation();
            }
        }

    }]).controller("ManagerCtrl", ["$scope", "$injector", "$location", "$routeParams", "CONFIG", "Urlmaker", "FavoritesModel", "FavoritesService",  function($scope, $injector, $location, $routeParams, CONFIG, Urlmaker, FavoritesModel, FavoritesService) {
        var currentView = CONFIG.view[$scope.ViewService.getCurrentView()],
            currentModel = currentView.model,
            viewModel,
            filter = eval(currentView.filter),
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            init = function(){
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = {};
                $scope.CONFIG.hasFavorites = currentView.favorites;
                $scope.CONFIG.topInclude = currentView.topInclude || false;
                $scope.CONFIG.status = currentView.status || false;
                $scope.CONFIG.projectName =  $routeParams.projectName;
                $scope.CONFIG.menuItems = currentView.filterMenu;
                $scope.CONFIG.displayActionsCreate = currentView.displayActionsCreate;

                // detemine which view model to get
                if (currentModel){
                    viewModel = $injector.get(currentModel);
                }

                // if there is a view model get the associated data
                if (viewModel) {
                    viewModel.get().then(function(response) {
                        $scope.data = response;
                        $scope.SortAndFilterService.init({
                            data: response,
                            orderBy: orderBy,
                            filter: filter,
                            reverse: reverse
                        });

                        // get favorite data, if view has favorites
                        if ($scope.CONFIG.hasFavorites) {
                            // the master project is always a favorite and not in the favorite REST call (yet)
                            var master;
                            _.each($scope.data, function(element){
                               master = _.find(element, function(elem){return elem.isMaster})
                            })

                            // get all favorites
                            FavoritesModel.get().then(function(response){
                                FavoritesService.setFavorites(_.pluck(response, 'uuid'));
                                FavoritesService.addFavorite(master.id);
                            })
                        }
                    });

                    $scope.ViewService.setModel(viewModel);
                } else {
                    console.info ("no view model")
                }

                //TEMP CODE !!!!!!!!!!!!
                if ($scope.ViewService.getCurrentView() == "Dashboard"){
                    $scope.CONFIG.hasAlerts = true;
                    $scope.alertSrc = "views/includes/alert.tpl.html"
                }
            }

        init();
        $scope.goto = function(where, evt){
            switch(currentView.where){
                case "gotoScenarioEdit": $scope.gotoScenarioEdit(where, evt); break;
                case "gotoDashboard": $scope.gotoDashboard(where, evt); break;
            }
        }

        // Controller API
        $scope.gotoDashboard = function(item, evt){
            Urlmaker.makeUrl("dashboard", item.title);
            evt.stopPropagation();
        }

        $scope.gotoScenarioEdit = function(item, evt){
            Urlmaker.makeUrl("scenarioEdit", $scope.CONFIG.projectName, item);
            evt.stopPropagation();
        }

        $scope.gotoProjects = function(evt){
            Urlmaker.makeUrl("projects");
            evt.stopPropagation();
        }

        // Event Listeners
        $scope.$on("CreateCtrl:create", function (event, data){
            Urlmaker.makeUrl("scenarioCreate", $scope.CONFIG.projectName, data.name)
        });

        $scope.$on("ProjectCreateCtrl:create", function (event, data){
            Urlmaker.makeUrl("dashboard", data)
        });

    }]).controller('InfoTrayCtrl', ["$scope", function($scope) {
        $scope.selectedItem = $scope.ActiveSelection.getActiveItem();
        $scope.seeAll = false;

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }
        });
    }]).controller("ScenarioEditCtrl", ["$scope", "$routeParams", "Urlmaker", function($scope, $routeParams, Urlmaker) {
        $scope.projectName = $routeParams.project;
        $scope.entity = $routeParams.entity;
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];

        $scope.backToProject = function(project){
            Urlmaker.makeUrl ("dashboard", project);
        }

    }]).controller("ScenarioCreateCtrl", ["$scope", "$routeParams", "Urlmaker", function($scope, $routeParams, Urlmaker){
        $scope.scenario = {
            name: $routeParams.scenarioName,
            project: $routeParams.projectName
        }

        $scope.editScenario = function (project, scenario){
            Urlmaker.makeUrl ("scenarioEdit", project, scenario);
        }
    }])