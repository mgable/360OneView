/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("ScenarioListingCtrl", ["$scope", "$rootScope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", "ManageScenariosService", "ScenarioStatesService", "$state", 'GotoService',
    function($scope, $rootScope, $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService, ManageScenariosService, ScenarioStatesService, $state, GotoService) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        // bootstrap all data
        var init = function(project, scenarios){
            $scope.init(scenarios, getProject);

            $scope.project = project;
            $scope.scenarios = scenarios;

            ScenarioStatesService.startPull(_.pluck($scope.scenarios, 'id'));

            $scope.hasAlerts = scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;
            $scope.hasAlerts = ($scope.project.isMaster && ScenarioService.isPlanOfRecordCreating()) ? $scope.CONFIG.planOfRecordCreate : $scope.hasAlerts;
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
            DialogService.openCreateScenario($scope.project, $scope.scenarios);
        };

        // $scope.isScenarioTitleUnique = function(scenarioName) {
        //     return !_.findWhere($scope.scenarios, {name: scenarioName});
        // };

        $scope.gotoBaseScenario = function(scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                $scope.goto({},"gotoBaseScenario", project.uuid, scenario.id);
            });
        };

        $scope.createTemplate = function() {
            $state.go('ScenarioTemplates');
        };

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function(){
            $scope.gotoScenarioCreate();
        });

        $scope.$on(EVENTS.copyScenario, function(evt, scenario){
            // sanaize scenario by deleting id and making sure it has a description
            delete scenario.id;
            scenario.description = scenario.description || "";
            ScenarioService.create(getProject().uuid, scenario).then(function(response){
                $scope.goto(evt, 'gotoScenarioEdit', response);
            });
        });

        $scope.$on(EVENTS.renameScenario, function(evt, scenario){
            ScenarioService.rename(scenario, getProject().uuid);
        });

        $scope.$on(EVENTS.editScenario, function($event, scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                 ScenarioService.edit(scenario, project.uuid);
            });
        });

        $scope.$on(EVENTS.broadcastStates, function($event, response) {
            addStatusToScenarios($scope.scenarios, response);
        });

        $scope.$on(EVENTS.planOfRecordCreated, function(event, scenario) {
            ScenarioService.get($scope.project.uuid).then(function(scenarios) {
                $scope.hasAlerts = false;
                ScenarioStatesService.stopPull();
                init($scope.project, scenarios);
            });
        });

        init(Project, Scenarios);
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "GotoService", "DialogService", "EVENTS", "CONFIG", "$timeout", function($scope, $controller, FavoritesService, ProjectsService, ScenarioService, Projects,  GotoService, DialogService, EVENTS, CONFIG, $timeout) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        var init = function(){
            $scope.init(Projects, getProject);
            ProjectsService.getMasterProject().then(function(master) {
                if (master) { 
                    // add it to even queue to keep it from getting in before the all other favorites 
                    $timeout(function() {FavoritesService.addFavorite(master.uuid);})
                }
            });
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

        $scope.getSorter = function(column) {
            return SortAndFilterService.getSorter(column);
        };

        $scope.getCount = function() {
            return SortAndFilterService.getCount();
        };

        $scope.setFilter = function(type, item, forceFilter) {
            SortAndFilterService.setFilter(type, item, forceFilter);
        };

        $scope.create = function(action, _data_) {
            console.info("here!!!!!!");
            var data = _data_ || {};
            $rootScope.$broadcast(EVENTS[action], data);
        };

        $scope.toggleFavorite = function(evt, item){
            evt.stopPropagation();
            var itemId = item.uuid || item.id;
            if (!item.isMaster) {
                FavoritesService.toggleFavorite(itemId, $scope.CONFIG.favoriteType, item);
                SortAndFilterService.filter();
                selectFirstItem();
            }
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        // tray button actions
        // NOT inline edit action
         $scope.action = function(action, _data_){
            var data = _data_ || {};
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

        $scope.isScenarioTitleUnique = function(scenarioName) {
            return !_.findWhere($scope.scenarios, {name: scenarioName});
        };

        // tray event listeners
        $scope.$on(EVENTS.filter, function(){
            selectFirstItem();
        });

        $scope.$on(EVENTS.trayCopy, function(evt, action, data){
            data.validator = $scope.isScenarioTitleUnique;
            data.errorType = "isNotUnique";
            if (data){
                DialogService[action](data);
            } else {
                DialogService.notify("ERROR: no scenarios", "There are no scenarios to copy.");
            }
        });

    }]);