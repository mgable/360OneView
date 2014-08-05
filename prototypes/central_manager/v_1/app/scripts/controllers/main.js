'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
    .controller('MainCtrl', function($scope, $route, $timeout, SortAndFilterService, FileDeleteService, ActiveSelection, InfoTrayService, DiaglogService, FavoritesService, ProjectsModel) {
        // make all services available to app
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;
        $scope.FavoritesService = FavoritesService;

        // convenience methods
        $scope.console = function(msg) {
            console.info(msg);
        }

        $scope.alert = function(msg) {
            alert(msg);
        }

    })

.controller("ManagerCtrl", function($scope, $injector, CONFIG, SortAndFilterService, ViewService) {

    var viewModel = $injector.get(CONFIG.view[ViewService.getCurrentView()].model),
        filter = eval(CONFIG.view[ViewService.getCurrentView()].filter),
        reverse = CONFIG.view[ViewService.getCurrentView()].reverse,
        orderBy = CONFIG.view[ViewService.getCurrentView()].orderBy;

    viewModel.$get().$futureData.then(function(response) {
        $scope.$apply(SortAndFilterService.init({
            data: response,
            orderBy: orderBy,
            filter: filter,
            reverse: reverse
        }));
    });

    ViewService.setModel(viewModel);

}).controller('InfoTrayCtrl', function($scope, ActiveSelection) {
    $scope.selectedItem = ActiveSelection.getActiveItem();
    $scope.seeAll = false;

    $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
        if (response.data !== "") {
            $scope.selectedItem = response.data;
        }
    });

}).controller('SearchCtrl', function($scope, $route, CONFIG) {
    $scope.menuItems = CONFIG.view[$route.current.$$route.viewName].menuItems;
}).controller("ScenarioEditCtrl", function($scope) {
    //$scope.foo = "bar";
});