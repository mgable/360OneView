/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
    .controller("MainCtrl", ["$scope", "$location", "ErrorService", function($scope, $location, ErrorService) {
        // Error service surfaced here
        // For unit testing only;
        $scope.ErrorService = ErrorService;

        // querystring 'e2e' formats data for protractor tests
        if ($location.search().e2e === "true"){
            $scope.e2e = true;
        }

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

    }]).controller("NavigationCtrl", ["$scope", function($scope){
        // Not sure if this is even needed
    }]).controller("ScenarioListingCtrl", ["$scope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", function($scope,  $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService) {

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
            }
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
        };

        $scope.gotoScenarioCreate = function(){
            DialogService.openCreateScenario(Project, Scenarios);
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
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "GotoService", "DialogService", "EVENTS", function($scope, $controller, FavoritesService, ProjectsService, ScenarioService, Projects,  GotoService, DialogService, EVENTS) {

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
            var newProject = angular.copy($scope.CONFIG.application.models.ProjectsModel.newProject);
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
            _.extend($scope.CONFIG, CONFIG);

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


        $scope.goto = function(evt, where, item){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit($scope.getProject().id, item.id); break;
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

    }]).controller("ScenarioCtrl", ["$scope", "Project", "Scenario", "ScenarioAnalysisElements", "Views", "ptData", "$state", "EVENTS", "ScenarioElementService", "DialogService", "ScenarioCalculateService",
    function($scope, Project, Scenario, ScenarioAnalysisElements, Views, ptData, $state, EVENTS, ScenarioElementService, DialogService, ScenarioCalculateService) {

        $scope.$on(EVENTS.filter, function(){
            $scope.showDetails(SortAndFilterService.getData()[0]);
        });

        // var findElementByType = function(type) {
        //     var selectedElement = _.find(ScenarioAnalysisElements, function(fileName) {
        //         return (fileName.id === type.id);
        //     });
        //     // $scope.$broadcast(EVENTS.selectScenarioElement, selectedElement);
        //     return selectedElement;
        // },
        var init = function() {
            $scope.project = Project;
            $scope.scenario = Scenario;
            $scope.views = Views;
            $scope.scenarioElements =  ScenarioAnalysisElements;
            $scope.setScenarioElement($scope.scenarioElements[0]);
            $scope.location = $state.current.url;
            $scope.scenarioIsCalculated = false;
            // hardcoded data
            $scope.pivotTableData = ptData.data;
            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};
            // ScenarioElementService.copyAndReplaceAnalysisElementForCube(172, 2, 63, {"name":"Behrooz", "description": "Behrooz"}).then(function(response){});
        };

        $scope.getScenarioElements = function() {
            return $scope.scenarioElements;
        };

        $scope.setCalculate = function(param) {
            $scope.scenarioIsCalculated = param;
        }

        $scope.setScenarioElement = function(type) {
            var element = findElementByType(type);

            $scope.$broadcast(EVENTS.selectScenarioElement, element);
            $scope.selectedScenarioElement = element;
            $scope.cubeId = element.cubeMeta.id;
            $scope.selectedScenarioElementsFile = element.name;
        };

        $scope.replaceScenarioElement = function(newElement) {
            _.each($scope.scenarioElements, function(element, index) {
                if(element.cubeMeta.id === newElement.cubeMeta.id) {
                    $scope.scenarioElements.splice(index, 1, newElement);
                }
            });
            $scope.selectedScenarioElement = newElement;
            $scope.selectedScenarioElementsFile = newElement.name;
        };

        $scope.$on('$locationChangeSuccess', function(){
            $scope.location = $state.current.url;
        });

        $scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement) {
            var dialog = DialogService.openFilterSelection('views/modal/scenario_analysis_element_files.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
                {selectedScenarioElement: selectedScenarioElement},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementFiles'});

            dialog.result.then(function(data) {
                $scope.replaceAnalysisElementForCube(scenarioId, selectedScenarioElement.cubeMeta.id, data.id);
            });
        };

        $scope.replaceAnalysisElementForCube = function(scenarioId, cubeId, elementId) {
            ScenarioElementService.replaceAnalysisElementForCube(scenarioId, cubeId, elementId).then(function(element) {
                $scope.replaceScenarioElement(element);
            });
        };

        $scope.openScenarioElementCopyModal = function(scenarioId, selectedScenarioElement) {
            var dialog = DialogService.openFilterSelection('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
                {selectedScenarioElement: selectedScenarioElement},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementCopy'});

            dialog.result.then(function(data) {
                $scope.copyAndReplaceAnalysisElementForCube($scope.scenario.id, $scope.cubeId, selectedScenarioElement.id, data);
            });
        };

        $scope.copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, newElementData) {
            ScenarioElementService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, sourceElementId, newElementData).then(function(element){
                $scope.replaceScenarioElement(element);
            });
        };

        $scope.calculateScenario = function() {
            $scope.setCalculate(true);
            $scope.location = "/results";
            ScenarioCalculateService.post($scope.scenario.id);
        }

        init();
    }]);