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

        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
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

    }]).controller("ScenarioCtrl", ["$scope", "Project", "Scenario", "ScenarioAnalysisElements", "ptData", "$state", "EVENTS", "ScenarioElementService", "DialogService", "PivotMetaService", "ScenarioCalculateService", "PivotDataService",
    function($scope, Project, Scenario, ScenarioAnalysisElements, ptData, $state, EVENTS, ScenarioElementService, DialogService, PivotMetaService, ScenarioCalculateService, PivotDataService) {

        $scope.$on(EVENTS.filter, function(){
            $scope.showDetails(SortAndFilterService.getData()[0]);
        });

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
            $scope.scenarioElements =  ScenarioAnalysisElements;
            $scope.setScenarioElement($scope.scenarioElements[0]);
            $scope.location = $state.current.url;
            $scope.toggleCalculation(false);
            $scope.toggleSuccess(false);
            // hardcoded data
            $scope.pivotTableData = ptData.data;
            // this is how pivotbuilder and pivottable communicate
            $scope.spread = {sheet: {}};
        }, initiateModel = function(cubeMeta) {
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
            });
        };

        $scope.loadPivotTable = function(elementId, viewId) {
            console.clear();
            PivotDataService.getSlice(70, 65).then(function(response) {
                console.log(response);
                var tableTree = {}, numCols = $scope.viewData.columns.length, numRows = $scope.viewData.rows.length, numLines = response.length;
                // var output = [];
                // _.each(response, function(row) {
                //     var line = '';

                //     var rowElms = [];
                //     _.each(row[0].key.value.coordinates.rowAddresses, function(rowElement) {
                //         rowElms.push(rowElement.cellValue.specification.members[0].label);
                //     });
                //     line = rowElms.join(',') + ': ';

                //     var colElms = [];
                //     _.each(row, function(column) {
                //         var colElm = [];
                //         _.each(column.key.value.coordinates.columnAddresses, function(columnElement) {
                //             colElm.push(columnElement.cellValue.specification.members[0].label);
                //         });
                //         colElms.push(colElm);
                //         line += ' --- ' + colElm.join(',');
                //     });
                //     console.log(line);
                //     // output.push({row: rowElms, col: colElms});
                // });
                // // console.log(output);
                var pivotTable = [], columnIndex = 2;
                pivotTable[0] = {0: '', 1: ''};
                pivotTable[1] = {0: '', 1: ''};
                _.each(response, function(row, rowIndex) {
                    pivotTable[rowIndex + numCols] = {};
                    _.each(row[0].key.value.coordinates.rowAddresses, function(rowElement, rowElementIndex) {
                        pivotTable[rowIndex + numCols][rowElementIndex] = rowElement.cellValue.specification.members[0].label;
                    });
                    _.each(row, function(column) {
                        var branch = [];
                        _.each(column.key.value.coordinates.columnAddresses, function(columnElement, columnIndex) {
                            if(columnIndex === 0) {
                                tableTree[columnElement.cellValue.specification.members[0].label] = branch[columnIndex] =
                                    tableTree[columnElement.cellValue.specification.members[0].label] || {};
                            } else if(columnIndex === numCols - 1) {
                                branch[columnIndex - 1][columnElement.cellValue.specification.members[0].label] = branch[columnIndex] =
                                    branch[columnIndex - 1][columnElement.cellValue.specification.members[0].label] || [];
                                    branch[columnIndex][rowIndex] = column.value.value;
                            } else {
                                branch[columnIndex - 1][columnElement.cellValue.specification.members[0].label] = branch[columnIndex] =
                                    branch[columnIndex - 1][columnElement.cellValue.specification.members[0].label] || {};
                            }
                        });
                    });
                });
                console.log(tableTree);

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
                $scope.spread.updateSheet(pivotTable, 0, numCols);
                console.log(pivotTable);
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
            $scope.location = $state.current.url;
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

        $scope.collapseTab = function() {
            this.tabClosed = true;
        };

        $scope.expandTab = function() {
            this.tabClosed = false;
        };

        $scope.toggleCalculation = function(value) {
            $scope.scenarioIsCalculated = value;
        }

        $scope.toggleSuccess = function(value) {
            $scope.calculationIsSuccess = value;
        }

        $scope.calculateScenario = function() {
            $scope.toggleCalculation(true);
            $scope.location = "/results";
            // ScenarioCalculateService.post($scope.scenario.id);
        }

        init();
    }]);