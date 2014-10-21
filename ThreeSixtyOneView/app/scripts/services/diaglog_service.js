'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DiaglogService', ["dialogs", function(dialogs) {
        this.rename = function(item, service) {
            dialogs.create('views/modal/rename_project.tpl.html', 'ProjectRenameCtrl', {
                item: item,
                service: service
            },{size: 'sm'});
        };

        this.create = function(type) {
            var createTypes = {
                'project': {
                    controller: 'ProjectCreateCtrl',
                    template: 'views/modal/create_project.tpl.html'
                }
            };
            dialogs.create(createTypes[type].template, createTypes[type].controller, {}, {
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
    }]);