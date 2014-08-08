'use strict';

// View controllers
angular.module("ThreeSixtyOneView")
    .controller("MainCtrl", function($scope, SortAndFilterService, FileDeleteService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ViewService) {
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

        $scope.alert = function(msg) {
            alert(msg);
        }
    }).controller("ManagerCtrl", function($scope, $injector, CONFIG) {

        var currentView = $scope.ViewService.getCurrentView(),
            viewModel = $injector.get(CONFIG.view[currentView].model),
            filter = eval(CONFIG.view[currentView].filter),
            reverse = CONFIG.view[currentView].reverse,
            orderBy = CONFIG.view[currentView].orderBy;

        $scope.menuItems = CONFIG.view[currentView].filterMenu;
        $scope.hasFavorites = CONFIG.view[currentView].favorites;
        $scope.data = {};

        viewModel.$get().$futureData.then(function(response) {
            $scope.data = response;
            $scope.$apply($scope.SortAndFilterService.init({
                data: response,
                orderBy: orderBy,
                filter: filter,
                reverse: reverse
            }));

            if ($scope.hasFavorites && $scope.data.master) {
                $scope.FavoritesService.addFavorite($scope.data.master);
            }
        });

        $scope.ViewService.setModel(viewModel);

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