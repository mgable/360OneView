'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DialogService', ["dialogs", function(dialogs) {
        this.create = function() {
            dialogs.create('views/modal/simple_input.tpl.html', 'ProjectCreateCtrl', {}, {
                windowClass: 'lightbox form-lightbox',
                backdrop: 'static'
            });
        };

        this.trayCopy = function(item){
            dialogs.create('views/modal/simple_input.tpl.html', 'ScenarioCopyCtrl', item, {
                windowClass: 'lightbox form-lightbox',
                backdrop: 'static'
            });
        };

        this.openCreateScenario = function(_project_, _scenarios_) {
            dialogs.create('views/modal/scenario_create.tpl.html','ScenarioCreateCtrl',{
                project: _project_,
                scenarios: _scenarios_
            },{size:'md', windowClass: 'lightbox form-lightbox', backdrop: 'static'});
        };

        this.openCreateOptimizationScenario = function(sharedObjects) {
            return dialogs.create('views/modal/optimization_scenario_create.tpl.html','OptimizationScenarioCreateCtrl', sharedObjects,{size:'md', windowClass: 'lightbox scenario-create-modal', backdrop: 'static'});
        };

        this.openLightbox = function(templateAddress, controllerName, sharedObjects, options) {
            return dialogs.create(templateAddress, controllerName, sharedObjects, {size: options.windowSize, windowClass: options.windowClass + ' lightbox', backdrop: 'static'});
        };

        this.noop = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.notify = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.filtersModal = function(dimension, addedFilters, viewData, dimensions, callback) {
            var dialog = this.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {
                dimension: dimension || {},
                addedFilters: addedFilters || {},
                viewData: viewData || {},
                dimensions: dimensions || {},
                callback: callback || function(){}
            }, {
                windowSize: 'lg',
                windowClass: 'filters-modal'
            });

            dialog.result.then(function(data) {
                callback.call(null, data);
            });
        };

    }]);