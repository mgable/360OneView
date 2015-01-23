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
    }]).controller("ScenarioListingCtrl", ["$scope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", "ScenarioElementService", function($scope,  $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService, ScenarioElementService) {

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

    }]).controller("ScenarioCtrl", ["$scope", "Project", "Scenario", "ScenarioAnalysisElements", "ptData", "$state", "EVENTS", "ScenarioElementService", "DialogService", "PivotMetaService", "Calculate", "PivotDataService", "PivotViewService",
    function($scope, Project, Scenario, ScenarioAnalysisElements, ptData, $state, EVENTS, ScenarioElementService, DialogService, PivotMetaService, Calculate, PivotDataService, PivotViewService) {

        // $scope.$on(EVENTS.filter, function(){
        //     $scope.showDetails(SortAndFilterService.getData()[0]);
        // });

        $scope.$on(EVENTS.selectScenarioElement, function(evt, element) {
            $scope.cubeId = element.cubeMeta.id;
            initiateModel(element.cubeMeta);
        });

        var init = function() {
            $scope.draftView = false;
            $scope.added = {};
            $scope.addedFilters = {};
            $scope.categorizedValue = [];
            $scope.viewData = [];
            $scope.viewDataExport = [];

            $scope.project = Project;
            $scope.scenario = Scenario;
            $scope.views = {
                views: [],
                currentView: {
                    name: 'Loading...'
                }
            };
            $scope.scenarioElements = ScenarioAnalysisElements;

            $scope.setScenarioElement(getScenarioElementById($scope.scenarioElements, parseInt($state.params.scenarioElementId)) || $scope.scenarioElements[0]);
            // remove param from path
            

            // hardcoded data
            $scope.pivotTableData = ptData.data;
            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};
            $scope.getlocation();
            $scope.currentState = Calculate.currentState;
        }, 
        initiateModel = function(cubeMeta) {
            PivotMetaService.initModel(cubeMeta).then(function(result) {
                var foundView = _.find(result.viewsList, function(view){ return view.id === result.view.id; });
                if (foundView) {
                    $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
                }
                $scope.viewsList = result.viewsList;
                $scope.views.currentView = result.view;
                $scope.viewData = result.view;
                $scope.viewDataExport = result.view.rows.concat(result.view.columns);
                $scope.viewName = result.view.name;
                $scope.added = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
                $scope.dimensions = result.dimensions;

                $scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.view);

                $scope.loadPivotTable($scope.selectedScenarioElement, result.view);
            });
        },
        getScenarioElementById = function(data, id){
           return  _.findWhere(data, {id: id});
        };

        $scope.isCalculated = function(){
            return Calculate.currentState.completed;
            //$scope.isCalculated = (Calculate.currentState.completed === "not calculated") ? false : true ;
            // $scope.inProgress = (Calculate.currentState.completed === "false") ? true : false ;
            // $scope.hasError = 
            
        };

        $scope.getlocation = function (){
            var url = $state.current.url.match(/\/\w+/)[0],
                location;

            switch(url){
                case "/edit" : location = url; break;
                default: location = "/results";
            };

            console.info(location);
            $scope.location = location;
        }

        $scope.gotoResults = function(){
            if (!Calculate.currentState.completed || Calculate.currentState.name === "FAILED") {
                $state.go("Scenario.calculate");
            } else {
                $state.go("Scenario.results");
            }
        };

        // load a view from the backend
        $scope.loadView = function(cubeId, viewId) {
            PivotViewService.getView(viewId, cubeId).then(function(view) {
                // remove the draft view if one exists and is not selected
                if($scope.draftView) {
                    var draftId;

                    _.each($scope.viewsList, function(listItem) {
                        if(listItem.name.substring(0, 8) === 'Draft - ') {
                            draftId = listItem.id;
                        }
                    });

                    if(viewId !== draftId) {
                        $scope.deleteView($scope.cubeId, draftId);
                    }
                }

                $scope.views.currentView = view;
                $scope.viewData = view;
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

                $scope.loadPivotTable($scope.selectedScenarioElement, view);
            });
        };

        // delete a view
        $scope.deleteView = function(cubeId, viewId) {
            PivotViewService.deleteView(viewId, cubeId).then(function() {
                $scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
                $scope.draftView = false;
            });
        };

        // create a new view
        $scope.createView = function(cubeId, view, viewList) {
            var i;
            $scope.viewsList = viewList;
            // remove conflicting elements from the view
            view.id = null;
            for(i = 0; i < view.filters.length; i++) {
                view.filters[i].id = null;
            }

            return PivotViewService.createView(view, cubeId).then(function(view) {
                $scope.viewData = angular.copy(view);
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.viewsList.unshift(view);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                return view;
            });
        };

        // save the view
        $scope.updateView = function(cubeId, view) {
            // filter ids should be set to zero before update
            _.each(view.filters, function(filter) {
                filter.id = 0;
            });
            return PivotViewService.updateView(view, cubeId).then(function(response) {
                return response;
            });
        };

        // save the draft view
        $scope.saveDraftView = function() {
            if(!$scope.draftView) {
                $scope.draftView = true;
                var draftView = angular.copy($scope.viewData);
                draftView.name = 'Draft - ' + draftView.name;
                $scope.createView($scope.cubeId, draftView, $scope.viewsList).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            } else {
                $scope.updateView($scope.cubeId, $scope.viewData).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            }
        };

        // save the changes in the current view
        $scope.saveView = function() {
            if($scope.draftView) {
                var originalViewName = $scope.viewData.name.substring(8);
                var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
                var draftViewId = $scope.viewData.id;

                $scope.viewData.name = originalViewName;
                $scope.viewData.id = originalViewId;
                $scope.updateView($scope.cubeId, $scope.viewData).then(function(view) {
                    $scope.viewData = view;
                    $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                });
                $scope.deleteView($scope.cubeId, draftViewId);
            }
        };

        $scope.loadPivotTable = function(element, view) {
            if(element.cubeMeta.id !== 1) return;
            PivotDataService.getSlice(element.id, view.id).then(function(response) {
                // console.log(response);
                var i, j,
                    tableTree = {},
                    numCols = view.columns.length,
                    numRows = view.rows.length,
                    numLines = response.length,
                    pivotTable = [],
                    columnIndex = numRows;

                for(i = 0; i < numCols; i++) {
                    pivotTable[i] = {};
                    for(j = 0; j < numRows; j++) {
                        pivotTable[i][j] = '';
                    }
                }

                _.each(response, function(row, rowIndex) {
                    pivotTable[rowIndex + numCols] = {};
                    _.each(row[0].key.value.coordinates.rowAddresses, function(rowElement, rowElementIndex) {
                        pivotTable[rowIndex + numCols][rowElementIndex] = rowElement.cellValue.specification.members[0].label;
                    });
                    _.each(row, function(column) {
                        var branch = [];
                        _.each(column.key.value.coordinates.columnAddresses, function(columnElement, columnIndex) {
                            var columnLabel = columnElement.cellValue.specification.members[0].label;

                            if(columnIndex === 0 && numCols > 1) {
                                tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || {};
                            } else if(columnIndex === 0) {
                                tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || [];
                                branch[columnIndex][rowIndex] = column.value.value;
                            } else if(columnIndex === numCols - 1) {
                                branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || [];
                                branch[columnIndex][rowIndex] = column.value.value;
                            } else {
                                branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || {};
                            }
                        });
                    });
                });

                var formPivotTable = function(tree, columnLabels) {
                    if(angular.isArray(tree)) {
                        _.each(tree, function(value, index) {
                            pivotTable[index + numCols][columnIndex] = value;
                        });
                        _.each(columnLabels, function(columnLabel, index) {
                            pivotTable[index] = pivotTable[index] || {};
                            pivotTable[index][columnIndex] = columnLabel;
                        });
                        columnIndex++;
                    } else if(angular.isObject(tree)) {
                        _.each(tree, function(branch, columnLabel) {
                            var newLabels = _.values(columnLabels);
                            newLabels.push(columnLabel);
                            formPivotTable(branch, newLabels);
                        });
                    }
                };
                formPivotTable(tableTree, new Array());

                $scope.spread.updateSheet(pivotTable, numCols, numRows);
            });
        };

        $scope.getScenarioElements = function() {
            return $scope.scenarioElements;
        };

        $scope.setScenarioElement = function(element) {
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
            $scope.getlocation();
        });

        // hide scenario copy and replace options if part of the marleting plan
        $scope.hiddenScenarioElement = function(element) {
            return element.group === 'Marketing Plan';
        };

        $scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement) {
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_files.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
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
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
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

        init();
    }]);