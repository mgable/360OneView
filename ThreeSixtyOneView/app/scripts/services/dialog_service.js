'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DialogService', ["dialogs", function(dialogs) {
        this.create = function() {
            dialogs.create('views/modal/simple_input.tpl.html', 'ProjectCreateCtrl', {}, {
                windowClass: 'lightbox form-lightbox'
            });
        };

        this.trayCopy = function(item){
            dialogs.create('views/modal/simple_input.tpl.html', 'ScenarioCopyCtrl', item, {
                windowClass: 'lightbox form-lightbox'
            });
        };

        this.openCreateScenario = function(_project_, _scenarios_) {
            dialogs.create('views/modal/scenario_create.tpl.html','ScenarioCreateCtrl',{
                project: _project_,
                scenarios: _scenarios_
            },{size:'md', windowClass: 'lightbox form-lightbox'});
        };

        this.openLightbox = function(templateAddress, controllerName, sharedObjects, options) {
            return dialogs.create(templateAddress, controllerName, sharedObjects, {size: options.windowSize, windowClass: options.windowClass + ' lightbox'});
        };

        this.noop = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.notify = function(header, msg){
            dialogs.notify(header,msg);
        };

    }]);