/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", ["$scope", "SortAndFilterService", "ActiveSelection", "InfoTrayService", "DiaglogService", "FavoritesService", "ViewService", function($scope, SortAndFilterService,  ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService) {
        // make all services available to app
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;
        $scope.FavoritesService = FavoritesService;
        $scope.ViewService = ViewService;

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

    }]).controller("ManagerCtrl", ["$scope", "$injector", "$location", "$stateParams", "$state", "CONFIG", "Urlmaker", "FavoritesModel", "FavoritesService", "ViewService",  function($scope, $injector, $location, $stateParams, $state, CONFIG, Urlmaker, FavoritesModel, FavoritesService, ViewService) {
        var currentView = CONFIG.view[$state.current.name],
            currentModel = currentView.model, filter = "",
            viewModel,
            /* jshint ignore:start */
            filter = eval(currentView.filter),
            /* jshint ignore:end */
            reverse = currentView.reverse,
            orderBy = currentView.orderBy,
            gotoDashboard = function(item){
                Urlmaker.gotoView("dashboard", item.title);
            },
            gotoScenarioEdit = function(item){
                Urlmaker.gotoView("scenarioEdit", $scope.CONFIG.projectName, item);
            },
            gotoProjects = function(){
                Urlmaker.gotoView("projects");
            },
            init = function(){
                // bootstrap view with data
                $scope.data = {};
                $scope.CONFIG = currentView;
                _.extend($scope.CONFIG, $stateParams);

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
                               master = _.find(element, function(elem){return elem.isMaster;});
                            });

                            // get all favorites
                            FavoritesModel.get().then(function(response){
                                FavoritesService.setFavorites(_.pluck(response, 'uuid'));
                                FavoritesService.addFavorite(master.id);
                            });
                        }
                    });

                    ViewService.setModel(viewModel);
                } else {
                    console.info ("no view model");
                }
            };

        init();

        // Controller API
        $scope.goto = function(where, item, evt){
            evt.stopPropagation();
            switch(where){
                case "gotoScenarioEdit": gotoScenarioEdit(item); break;
                case "gotoDashboard": gotoDashboard(item); break;
                case "gotoProjects": gotoProjects(); break;
            }
        };

        // Event Listeners
        $scope.$on("scenario:create", function (event){
            Urlmaker.gotoView("scenarioCreate", $scope.CONFIG.projectName);
        });

        $scope.$on("ProjectCreateCtrl:create", function (event, data){
            Urlmaker.gotoView("dashboard", data);
        });

    }]).controller('InfoTrayCtrl', ["$scope", "ViewService", function($scope, ViewService) {
        $scope.selectedItem = $scope.ActiveSelection.getActiveItem();
        $scope.disabled = true;

        $scope.update = function(item) {
            var service = ViewService.getModel();
            // TODO: refactor this out
            if (item.name !== item.title) {
                item.name = item.title;
                service.rename(item);
            }
        };

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
            $scope.disabled = true;
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }
        });
    }]).controller("ScenarioEditCtrl", ["$scope", "$stateParams", "Urlmaker", function($scope, $stateParams, Urlmaker) {
        $scope.projectName = $stateParams.project;
        $scope.entity = $stateParams.entity;
        $scope.types = ['Marketing Plan', 'Cost Assumptions',' Enviromental Factores', 'Economica Variables', 'Pricing Factors','Brand Factors'];
        $scope.scenarioElementType = $scope.types[0];

        $scope.backToProject = function(project){
            Urlmaker.gotoView ("dashboard", project);
        };

    }]).controller("ScenarioCreateCtrl", ["$scope", "$stateParams", "Urlmaker", function($scope, $stateParams, Urlmaker){
        $scope.scenario = {
            name: $stateParams.scenarioName,
            project: $stateParams.projectName
        };

        $scope.editScenario = function (project, scenario){
            Urlmaker.gotoView ("scenarioEdit", project, scenario);
        };
    }]);