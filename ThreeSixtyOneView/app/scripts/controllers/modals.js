/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ModalBaseCtrl", ["$scope", "$modalInstance", "CONFIG", function($scope, $modalInstance, CONFIG){
        $scope.inputRestrictions = CONFIG.application.inputRestrictions;

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };
    }]).controller("ScenarioCopyCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, data, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        $scope.item = data;
        $scope.item.title = "COPY -- " + $scope.item.title;
        $scope.modalProperties = {
            title: "Copy a Scenario",
            field: "Name",
            button: "Copy Scenario",
            icon: "files-o"
        };

         $scope.submit = function(title, evt){
            if (evt) { evt.preventDefault(); }
            $scope.item.title = title;
            $rootScope.$broadcast(EVENTS.copyScenario, $scope.item);
            $modalInstance.dismiss('create');
         };
    }]).controller('ProjectCreateCtrl', ["$scope", "$rootScope", "$controller", "$modalInstance", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));
        // var newProject = CONFIG.application.models.ProjectsModel.newProject;

        $scope.modalProperties = {
            title: "Create a New Project",
            field: "Name",
            button: "Create New Project",
            icon: "star"
        };

        $scope.submit = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            $rootScope.$broadcast(EVENTS.createProject, title.trim());
            $modalInstance.dismiss('create');
        };
    }]).controller('ScenarioCreateCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var getBaseScenario = function(){
                return angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
            },
            getSelected = function(){
                return selectedRow;
            },
            sortScenarios = function(scenarios){
                $scope.scenarioList = scenarios;
                $scope.masterProject = (_.findWhere($scope.scenarioList, {"title": "MASTER PROJECT"}));
                $scope.scenarioList.splice(_.indexOf($scope.scenarioList, $scope.masterProject),1);
                selectedBaseScenario = $scope.masterProject;

                angular.forEach($scope.scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        $scope.scenarioList.unshift($scope.scenarioList.splice(v,1)[0]);
                    }
                });
            },
            init = function(){
                ScenarioService.getAll().then(function(response){
                    sortScenarios(response);
                });
            },
            selectedBaseScenario;

        init();


        $scope.showFields = true;
        $scope.project = data.project;
        $scope.scenarios = data.scenarios;
        $scope.scenario = getBaseScenario();

        $scope.showBaseScenario = function() {
            $scope.showFields = false;
        };

        $scope.setScenario= function(item){
            selectedBaseScenario = item;
        };
        $scope.showRow = function(row){
            return row === selectedBaseScenario;
        };

        $scope.isScenarioTitleUnique = function(scenarioTitle) {
            return ! _.findWhere($scope.scenarios, {title:scenarioTitle});
        };

        $scope.confirm = function(){
            $scope.scenario.referenceScenario.id = selectedBaseScenario.id;
            $scope.scenario.referenceScenario.name = selectedBaseScenario.title;
            $scope.showFields = true;
        };

        $scope.cancel = function(){
            $scope.showFields = true;
        };

        $scope.submit = function(_scenario_){
            ScenarioService.create($scope.project, _scenario_).then(function(response){
                GotoService.scenarioEdit($scope.project.id, response.id);
            });
            $scope.close();
        };

        $scope.currentScenario = function (scenario){
            DialogService.currentScenario($scope.project, scenario);
        };

        $scope.$on(EVENTS.updateBaseScenario, function(event, data){
            $scope.scenario.referenceScenario.id = data.id;
            $scope.scenario.referenceScenario.name = data.title;
        });
    }]).controller('FilterSelectionCtrl', ["$scope", "$rootScope", "$modalInstance", "$controller", "data", "CONFIG", function($scope, $rootScope, $modalInstance, $controller, data, CONFIG) {
    angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

    var init = function() {
        $scope.selectedFilter = {};
        $scope.selectedFilter.selFil = data.selFil;
        $scope.selectedFilter.cat = data.cat;
        $scope.addedFilter = data.addedFilters;
        $scope.dimensions = data.dimensions;
        $scope.categorizeValues = data.categorizeValues;
        $scope.viewData = data.viewData;

        $scope.filterSearch = {label: ''};
        $scope.emptyFiltersList = [];
        $scope.noFilterSelected = false;

        $scope.chooseFilter($scope.selectedFilter.cat, false, false);
    };

    // open the filters modal for the selected filter
    $scope.chooseFilter = function(category, newSelection, index) {
        if(angular.isNumber(index)) {
            $scope.selectedFilter.selFil = $scope.chooseViewBy(category.members, index);
            return null;
        }

        $scope.selectedFilter.cat = category;
        $scope.selectedFilter.selFil = $scope.chooseViewBy(category.members, false);

        if(newSelection) {
            $scope.cancelChangeFilter();
        }
    };

    // choose a filter based on the passed name
    $scope.chooseFilterByName = function(name) {
        var i;

        for(i = 0; i < $scope.dimensions.length; i++) {
            if($scope.dimensions[i].label === name) {
                $scope.chooseFilter($scope.dimensions[i], false, false);
                return null;
            }
        }
    };

    // choose the view based on added items in the column/row
    $scope.chooseViewBy = function(items, index) {
        if(angular.isNumber(index)) {
            $scope.searchFilters(items[index], $scope.filterSearch);
            return items[index];
        }

        for(var i = 0; i < items.length; i++) {
            for(var j = 0; j < $scope.viewData.columns.length; j++) {
                if(items[i].label === $scope.viewData.columns[j].level.label) {
                    $scope.searchFilters(items[i], $scope.filterSearch);
                    return items[i];
                }
            }

            for(j = 0; j < $scope.viewData.rows.length; j++) {
                if(items[i].label === $scope.viewData.rows[j].level.label) {
                    $scope.searchFilters(items[i], $scope.filterSearch);
                    return items[i];
                }
            }
        }

        $scope.searchFilters(items[0], $scope.filterSearch);
        return items[0];
    };

    // cancel the made changes to the filter
    $scope.cancelChangeFilter = function() {
        // $scope.filterSearch = {label: ''};
        $scope.filterCollapse = {};
        $modalInstance.dismiss('canceled');
    };

    // search filter values
    $scope.searchFilters = function(obj, search) {
        if(!obj) {
            return null;
        }

        var output;

        var treeSearch = function(tree, searchLabel) {
            var output = {
                label: tree.label
            };

            if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1) {
                return tree;
            }

            if(tree.members.length > 0) {
                for(var i = 0; i < tree.members.length; i++) {
                    var results = treeSearch(tree.members[i], searchLabel);
                    if(results && results.members) {
                        if(!output.members) {
                            output.members = [];
                        }
                        output.members.push(results);
                    }
                }
            } else {
                if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1) {
                    return tree;
                } else {
                    return null;
                }
            }
            return output;
        };

        output = treeSearch(obj, search.label);

        $scope.searchResults = output;
        $scope.countFilters(output);
    };

    // count number of selected and total filters
    $scope.countFilters = function(object) {
        var output = {
            selected: 0,
            total: 0
        };

        if(!object.members) {
            $scope.filterCount = output;
            return output;
        }
        var treeCount = function(tree) {
            var output = {
                selected: 0,
                total: 0
            };

            if(tree.members.length > 0) {
                for(var i = 0; i < tree.members.length; i++) {
                    var results = treeCount(tree.members[i]);
                    output.selected += results.selected;
                    output.total += results.total;
                }
            } else {
                if($scope.addedFilter[$scope.selectedFilter.cat.label][tree.label]) {
                    output.selected++;
                }
                output.total++;
            }
            return output;
        };

        output = treeCount(object);
        $scope.filterCount = output;
        return output;
    };

    // handle select/deselect of visible/invisible filter search values
    $scope.selectFilters = function(category, visible, add) {
        var i = 0,
            val;

        var getFilters = function(list) {
            var output = [],
                i = 0;

            if(list.members.length > 0) {
                for(i = 0; i < list.members.length; i++) {
                    output = output.concat(getFilters(list.members[i]));
                }
            } else {
                return [list.label];
            }

            return output;
        };

        var list = getFilters($scope.searchResults);

        if(visible) {
            for(i = 0; i < list.length; i++) {
                $scope.addedFilter[category][list[i]] = add;
            }
        } else {
            for(val in $scope.addedFilter[category]) {
                if($scope.addedFilter[category][val] && list.indexOf(val) === -1) {
                    $scope.addedFilter[category][val] = add;
                }
            }
        }
    };

    // make the temporary changes in the filters
    $scope.changeFilter = function() {
        $modalInstance.close($scope.addedFilter);
    };

    init();

}]);