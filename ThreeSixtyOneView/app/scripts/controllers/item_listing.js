/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("ScenarioListingCtrl", ["$scope", "$rootScope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", "ManageScenariosService", "ScenarioStatesService", function($scope, $rootScope, $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService, ManageScenariosService, ScenarioStatesService) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        // bootstrap all data
        var init = function(){
            $scope.init(Scenarios, getProject);

            $scope.project = Project;
            $scope.scenarios = Scenarios;

            ScenarioStatesService.startPull(_.pluck($scope.scenarios, 'id'));

            $scope.hasAlerts = Scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;

            if($scope.project.isMaster){
                setMasterScenario($scope.scenarios[0]);
            }

            if ($scope.selectedItem) {
                getScenarioElements($scope.selectedItem.id);
            }
        },
        addStatusToScenarios = function(scenarios, statuses){
            _.each(scenarios, function(scenarioValue) {
                _.each(statuses, function(statusValue) {
                    if(statusValue.scenarioId === scenarioValue.id) {
                        _.extend(scenarioValue, _.omit(statusValue, ['id', 'scenarioId']));
                    }
                });
            });
        },
        getProject = function(){
            return $scope.project;
        },
        setMasterScenario = function(scenario){
            scenario.isMaster = true;
        },
        getScenarioElements = function(id){
            return  ManageScenariosService.get(id);
        };

        // API
        // Click handler interface
        $scope.selectItem = function(item){
            // the return is for unit tests, it does nothing in the UI
            $scope.showDetails(item);
            return $scope.getDetails(item.id, getScenarioElements).then(function(data){
                item.scenarioElements = data;
            });
        };

        $scope.gotoScenarioCreate = function(){
            DialogService.openCreateScenario(Project, Scenarios);
        };

        $scope.isScenarioTitleUnique = function(scenario) {
            return ! _.findWhere($scope.scenarios, {title: scenario});
        };

        $scope.gotoBaseScenario = function(scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                $scope.goto({},"gotoBaseScenario", project.uuid, scenario.id);
            });
        };

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function(){
            $scope.gotoScenarioCreate();
        });

        $scope.$on(EVENTS.copyScenario, function(evt, scenario){
            scenario.description = scenario.description || "";
            scenario.referenceScenario.id = scenario.id;
            scenario.referenceScenario.name = scenario.title;
            delete scenario.id;
            ScenarioService.create(getProject(), scenario).then(function(response){
                $scope.goto(evt, 'gotoScenarioEdit', response);
            });
        });

        $scope.$on(EVENTS.renameScenario, function(evt, scenario){
            ScenarioService.rename(scenario, getProject().id);
        });

        $scope.$on(EVENTS.editScenario, function($event, scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                 ScenarioService.edit(scenario, project.uuid);
            });
        });

        $scope.$on(EVENTS.broadcastStates, function($event, response) {
            addStatusToScenarios(Scenarios, response);
            $scope.scenarios = Scenarios;
        });

        init();
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "GotoService", "DialogService", "EVENTS", "CONFIG", function($scope, $controller, FavoritesService, ProjectsService, ScenarioService, Projects,  GotoService, DialogService, EVENTS, CONFIG) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        var init = function(){
            $scope.init(Projects, getProject);
            // the master project is always a favorite and not in the favorite REST call (yet?)
            var master = _.find(Projects, function(elem){return elem.isMaster;});
            if (master) { FavoritesService.addFavorite(master.uuid, $scope.CONFIG.favoriteType); }
        },
        getScenarios = function(id){
            return ScenarioService.get(id);
        },
        getProject = function(){
            return $scope.selectedItem;
        };

        // API
        // click handler interface
        $scope.selectItem = function(item){
            // the return is for unit tests, it does nothing in the UI
            $scope.showDetails(item);
            return $scope.getDetails(item.uuid, getScenarios).then(function(data){
                item.scenarios = data;
            });
        };

        // Event listeners
        // create new project dialog box to get new project title
        $scope.$on(EVENTS.getNewProjectTitle, function(){
            DialogService.create();
        });

        // create project API call
        $scope.$on(EVENTS.createProject, function(evt, name){
            var newProject = angular.copy(CONFIG.application.models.ProjectsModel.newProject);
            newProject.name = name;
            ProjectsService.create(newProject).then(function(response){
                GotoService.dashboard(response.uuid);
            });
        });

        init();
    }]).controller("ListingViewCtrl", ["$scope", "$rootScope", "$state", "SortAndFilterService", "DialogService", "GotoService", "CONFIG", "EVENTS", "FavoritesService", "$stateParams", "AnalyticCalculationsService", function($scope, $rootScope, $state, SortAndFilterService, DialogService, GotoService, CONFIG, EVENTS, FavoritesService, $stateParams, AnalyticCalculationsService){

        var selectFirstItem = function(){
                var firstItem = SortAndFilterService.getData()[0];
                if(firstItem){
                    $scope.selectItem(firstItem);
                }
            },
            getUuid = function(project){
                return project.uuid;
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

        $scope.getDetails = function(id, model){
            return model(id).then(function(response){
                return response;
            });
        };

        $scope.goto = function(evt, where, item, id){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit(getUuid($scope.getProject()), item.id, id); break;
                case "gotoScenarioCalculate": GotoService.scenarioCalculate(getUuid($scope.getProject()), item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.uuid); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoBaseScenario" : GotoService.baseScenario(item, id); break;
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

        $scope.isMasterProjectScenario = function(item){
            if (item){
                return (item.isMaster && $state.current.name === "Dashboard");
            }
        };

        $scope.getSorter = function(column) {
            return SortAndFilterService.getSorter(column);
        };

        $scope.getCount = function() {
            return SortAndFilterService.getCount();
        };

        $scope.setFilter = function(type, item, forceFilter) {
            SortAndFilterService.setFilter(type, item, forceFilter);
        };

        $scope.create = function(action, data) {
            $rootScope.$broadcast(EVENTS[action], data);
        };

        $scope.toggleFavorite = function(evt, item){
            evt.stopPropagation();
            if (!item.isMaster) {
                FavoritesService.toggleFavorite(item.uuid, $scope.CONFIG.favoriteType);
                SortAndFilterService.filter();
                selectFirstItem();
            }
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        // tray button actions
        // NOT inline edit action
         $scope.action = function(action, data){
            if(action){
                $rootScope.$broadcast(EVENTS[action], action, data);
            }
        };

        $scope.gotoScenarioCalculate = function(action, item) {
            if(!_.has(item, 'isMaster')) {
                if(AnalyticCalculationsService.isInProgress(item.currentState.message) || AnalyticCalculationsService.isFailed(item.currentState.message)) {
                    return 'gotoScenarioCalculate';
                } else {
                    return action;
                }
            } else {
                return action;
            }
        };

        // tray event listeners
        $scope.$on(EVENTS.filter, function(){
            selectFirstItem();
        });

        $scope.$on(EVENTS.trayCopy, function(evt, action, data){
            if (data){
                DialogService[action](data);
            } else {
                DialogService.notify("ERROR: no scenarios", "There are no scenarios to copy.");
            }
        });

    }]);