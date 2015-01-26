/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("ScenarioListingCtrl", ["$scope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", "ScenarioElementService", function($scope,  $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService, ScenarioElementService) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        // bootstrap all data
        var init = function(){
            $scope.init(Scenarios, getProject);

            $scope.project = Project;
            $scope.scenarios = Scenarios;
            $scope.hasAlerts = Scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;

            if($scope.project.isMaster){
                setMasterScenario($scope.scenarios[0]);
            };

            if ($scope.selectedItem) {
                $scope.getScenarioElements($scope.selectedItem.id);
            };
        },
        getProject = function(){
            return $scope.project;
        },
        setMasterScenario = function(scenario){
            scenario.isMaster = true;
        };

        // API
        // Click handler interface
        $scope.selectItem = function(item){
            $scope.showDetails(item);
            $scope.getScenarioElements(item.id);
        };

        $scope.gotoScenarioCreate = function(){
            DialogService.openCreateScenario(Project, Scenarios);
        };

        $scope.getScenarioElements = function(id){
            ScenarioElementService.get(id).then(function(response){
                $scope.scenarioElements = response;
            });
        };

        $scope.isScenarioTitleUnique = function(scenario) {
            return ! _.findWhere($scope.scenarios, {title: scenario});
        };

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function(){
            $scope.gotoScenarioCreate();
        });

        $scope.$on(EVENTS.copyScenario, function(evt, scenario){
            scenario.description = scenario.description || "";
            delete scenario.id;
            ScenarioService.create(getProject(), scenario).then(function(response){
                $scope.goto(evt, 'gotoScenarioEdit', response);
            });
        });

        $scope.$on(EVENTS.renameScenario, function(evt, scenario){
            ScenarioService.rename(scenario, getProject().id);
        });

        init();
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "GotoService", "DialogService", "EVENTS", "CONFIG", function($scope, $controller, FavoritesService, ProjectsService, ScenarioService, Projects,  GotoService, DialogService, EVENTS, CONFIG) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        var init = function(){
            $scope.init(Projects, getProject);
            // the master project is always a favorite and not in the favorite REST call (yet?)
            var master = _.find(Projects, function(elem){return elem.isMaster;});
            if (master) { FavoritesService.addFavorite(master.id, $scope.CONFIG.favoriteType); }

            // Highlight first item
            $scope.selectItem($scope.selectedItem);
        },
        getScenarios = function(id){
            return ScenarioService.get(id);
        },
        getDetails = function(item, model){
            return model(item.id).then(function(response){
                return response;
            });
        },
        getProject = function(){
            return $scope.selectedItem;
        };

        // API
        // click handler interface
        $scope.selectItem = function(item){
            // the return is for unit tests, it does nothing in the UI
            return getDetails(item, getScenarios).then(function(data){
                item.scenarios = data;
                $scope.showDetails(item);
            });
        };

        // Event listeners
        $scope.$on(EVENTS.getNewProjectTitle, function(){
            DialogService.create();
        });

        $scope.$on(EVENTS.createProject, function(evt, title){
            var newProject = angular.copy(CONFIG.application.models.ProjectsModel.newProject);
            newProject.title = title;
            ProjectsService.create(newProject).then(function(response){
                GotoService.dashboard(response.id);
            });
        });

        init();
    }]).controller("ListingViewCtrl", ["$scope", "$rootScope", "$state", "SortAndFilterService", "DialogService", "GotoService", "CONFIG", "EVENTS", "FavoritesService", "$stateParams", function($scope, $rootScope, $state, SortAndFilterService, DialogService, GotoService, CONFIG, EVENTS, FavoritesService, $stateParams){

        var selectFirstItem = function(){
            $scope.showDetails(SortAndFilterService.getData()[0]);
        };

        $scope.init = function(_data_, fn){
            var currentView = CONFIG.view[$state.current.name],
                filter = currentView.filterMenu.items[0],
                reverse = currentView.reverse,
                orderBy = currentView.orderBy;

            $scope.CONFIG = currentView;
            $scope.data = _data_;
            $scope.selectedItem = null;
            $scope.getProject = fn;

            // tray variables
            $scope.showScenario = false;
            $scope.viewAll = 'View All';
            $scope.trayActions = CONFIG.view[$state.current.name].trayActions;

            _.extend($scope.CONFIG, $stateParams);
            _.extend($scope.CONFIG, CONFIG.view[$state.current.name]);

            SortAndFilterService.resetSearchText();

            SortAndFilterService.init({
                data: _data_,
                orderBy: orderBy,
                filter: filter,
                reverse: reverse
            });

            // select first time in list
            selectFirstItem();
        };


        $scope.goto = function(evt, where, item, id){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit($scope.getProject().id, item.id, id); break;
                case "gotoDashboard": GotoService.dashboard(item.id); break;
                case "gotoProjects": GotoService.projects(); break;
            }
        };

        $scope.showDetails = function(item){
            $scope.selectedItem = item;
            $rootScope.$broadcast(EVENTS.newSelectedItem, $scope.selectedItem);
        };

        $scope.isActiveItem = function (item){
            return $scope.selectedItem === item;
        };

        $scope.getData = function () {
            return SortAndFilterService.getData();
        };

        $scope.getSorter = function(column) {
            return SortAndFilterService.getSorter(column);
        };

        $scope.getCount = function() {
            return SortAndFilterService.getCount();
        };

        $scope.setFilter = function(type, item, forceFilter) {
            SortAndFilterService.setFilter(type, item, forceFilter);
            selectFirstItem();
        };

        $scope.toggleFavorite = function(evt, item){
            evt.stopPropagation();
            if (!item.isMaster) {
                FavoritesService.toggleFavorite(item.id, $scope.CONFIG.favoriteType);
                SortAndFilterService.filter();
                selectFirstItem();
            }
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        // tray actions
         $scope.action = function(action, data){
            if(action){
                $rootScope.$broadcast(EVENTS[action], action, data);
            }
        };

        $scope.toggleShowScenarios = function() {
            $scope.showScenario = !$scope.showScenario;
            $scope.viewAll = ($scope.showScenario) ? 'View Less' : 'View All';
        };

        // tray event listners
        $scope.$on(EVENTS.trayCopy, function(evt, action, data){
            if (data){
                DialogService[action](data);
            } else {
                DialogService.notify("ERROR: no scenarios", "There are no scenarios to copy.");
            }
        });


        $scope.$on(EVENTS.noop, function(event, action){
            DialogService[action]("Functionality TBD", "The functionality of this control is TDB");
        });

    }]);