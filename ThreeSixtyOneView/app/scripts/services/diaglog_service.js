'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DiaglogService', ["InfoTrayService", "FileDeleteService", "dialogs", function(InfoTrayService, FileDeleteService, dialogs) {
        this.trash = function(item) {
            if (item) {
                FileDeleteService.setFilesToDelete([item]);
            }
            dialogs.create('views/modal/delete.html', 'DeleteCtrl', InfoTrayService.closeInfoTray);
        };

        this.copy = function(item, config, service) {
            var header = config.header || "Copy",
                text = config.text || "Do you want to copy ",
                dlg = dialogs.confirm(header, text + item.title + "?");

            dlg.result.then(
                function(btn) {
                    console.info(btn);
                    service.$clone(item.id);
                },
                function(btn) {
                    console.info(btn);
                }
            );
        };

        this.name = function (item, data, service){
            dialogs.create('views/modal/name.html', 'NameCtrl', {
                item: item,
                service: service,
                config: data.config
            });
        };

        this.rename = function(item, service) {
            dialogs.create('views/modal/rename.html', 'RenameCtrl', {
                item: item,
                service: service
            });
        };

        this.create = function(type) {
            var createTypes = {
                'element': {
                    controller: 'CreateCtrl',
                    template: 'views/modal/create_scenario.tpl.html'
                },
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