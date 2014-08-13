'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", function($scope, $location, SortAndFilterService, FileDeleteService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService) {
        // make all services available to app
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;
        $scope.FavoritesService = FavoritesService;
        $scope.ViewService = ViewService;
        // for testing only
        $scope.foo = "foobar!!!!";

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

        $scope.gotoDashboard = function(item, evt){
            console.info("gotoDASHBOARD " + "/dashboard/" + item.title)
            $location.path("/dashboard/" + item.title);
            evt.stopPropagation();
        }

        $scope.gotoScenarioEdit = function(item, evt){
             console.info("goto scenario edit")
            $location.path("/scenarioEdit");
            evt.stopPropagation();
        }

    }).controller("ManagerCtrl", function($scope, $injector,  $routeParams, CONFIG) {

        var currentView = CONFIG.view[$scope.ViewService.getCurrentView()],
            currentModel = currentView.model,
            viewModel,
            filter = eval(currentView.filter),
            reverse = currentView.reverse,
            orderBy = currentView.orderBy;

        $scope.data = {};
        $scope.CONFIG = {};
        $scope.CONFIG.hasFavorites = currentView.favorites;
        $scope.CONFIG.topInclude = currentView.topInclude || false;
        $scope.CONFIG.status = currentView.status || false;
        $scope.CONFIG.routeParams =  $routeParams;
        $scope.CONFIG.menuItems = currentView.filterMenu;
        $scope.goto = $scope[currentView.where];

        if (currentModel){
            viewModel = $injector.get(currentModel);
        }

        if (viewModel) {
            viewModel.$get().$futureData.then(function(response) {
                $scope.data = response;
                $scope.$apply($scope.SortAndFilterService.init({
                    data: response,
                    orderBy: orderBy,
                    filter: filter,
                    reverse: reverse
                }));

                if ($scope.CONFIG.hasFavorites && $scope.data.master) {
                    $scope.FavoritesService.addFavorite($scope.data.master);
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

    }).controller('InfoTrayCtrl', function($scope) {
        $scope.selectedItem = $scope.ActiveSelection.getActiveItem();
        $scope.seeAll = false;

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }
        });

    }).controller("ScenarioEditCtrl", function($scope) {
        //$scope.foo = "bar";
    });