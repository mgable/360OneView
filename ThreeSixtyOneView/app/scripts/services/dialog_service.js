'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DialogService', ["dialogs", function(dialogs) {
        this.create = function() {
            dialogs.create('views/modal/simple_input.tpl.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        };

        this.trayCopy = function(item){
            dialogs.create('views/modal/simple_input.tpl.html', 'ScenarioCopyCtrl', item, {
                size: 'sm'
            });
        };

        this.openCreateScenario = function(_project_, _scenarios_) {
            dialogs.create('views/modal/scenario_create.tpl.html','ScenarioCreateCtrl',{
                project: _project_,
                scenarios: _scenarios_
            },{size:'md'});
        };

        this.openFilterSelection = function(templateAddress, controllerName, sharedObjects, options) {
            return dialogs.create(templateAddress, controllerName, sharedObjects, {size: options.windowSize, windowClass: options.windowClass});
        };

        this.noop = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.notify = function(header, msg){
            dialogs.notify(header,msg);
        };

    }]);