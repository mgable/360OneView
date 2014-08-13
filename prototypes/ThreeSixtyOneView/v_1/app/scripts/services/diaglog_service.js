'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DiaglogService', function(InfoTrayService, FileDeleteService, dialogs) {
        this.trash = function(item) {
            if (item) {
                FileDeleteService.setFilesToDelete([item]);
            }
            dialogs.create('/views/modal/delete.html', 'DeleteCtrl', InfoTrayService.closeInfoTray);
        }

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
                    console.info(btn)
                }
            )
        }

        this.name = function (item, config, service){
            console.info(config)
            dialogs.create('/views/modal/name.html', 'NameCtrl', {
                item: item,
                service: service,
                config: config.config
            });
        }

        this.rename = function(item, service) {
            dialogs.create('/views/modal/rename.html', 'RenameCtrl', {
                item: item,
                service: service
            });
        }

        this.create = function(type) {
            console.info("create");
            var createTypes = {
                'element': {
                    controller: 'CreateCtrl',
                    template: '/views/modal/create_scenario_element.html'
                },
                'project': {
                    controller: 'ProjectCreateCtrl',
                    template: '/views/modal/create_project.html'
                }
            };
            dialogs.create(createTypes[type].template, createTypes[type].controller, {}, {
                size: 'sm'
            });
        }
    });