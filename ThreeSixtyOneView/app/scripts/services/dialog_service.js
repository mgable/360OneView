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

        //Prototype
        this.currentScenario = function(_project_, _scenario_) {
            dialogs.create('views/modal/create_scenario.tpl.html','CreateScenarioCtrl',{
                project: _project_,
                scenario: _scenario_
            },{size:'md'});
        };

<<<<<<< HEAD
        this.openCreateScenario = function(_project_, _scenario_) {
            dialogs.create('views/modal/scenario_create.tpl.html','OpenCreateScenarioCtrl',{
                project: _project_,
                scenario: _scenario_
            },{size:'md'});
        };

        this.noop = function(header, msg){
=======
        this.notify = function(header, msg){
>>>>>>> 1a6959e09b94717efd843743dec7b1668fb514d2
            dialogs.notify(header,msg);
        };

        // useful aliases
        this.noop = this.notify;
        
    }]);