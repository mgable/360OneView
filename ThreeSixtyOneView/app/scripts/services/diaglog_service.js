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
        this.current_scenario = function(scenario) {
            dialogs.create('views/modal/current_scenario.tpl.html','ProjectCurrentScenarioCtrl',{
                scenario: scenario
            },{size:'md'});
        };
    }]);