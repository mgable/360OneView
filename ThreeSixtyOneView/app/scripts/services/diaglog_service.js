'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DiaglogService', ["dialogs", function(dialogs) {
        this.rename = function(item, service) {
            dialogs.create('views/modal/rename_project.html', 'ProjectRenameCtrl', {
                item: item,
                service: service
            });
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
    }]);