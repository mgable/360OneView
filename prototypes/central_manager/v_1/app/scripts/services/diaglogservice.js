'use strict';

angular.module('ThreeSixtyOneView')
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
                    //FilesModel.$clone(item.id);
                    service.$clone(item.id);
                },
                function(btn) {
                    console.info(btn)
                }
            )
        }

        this.rename = function(item, service) {
            dialogs.create('/views/modal/rename.html', 'RenameCtrl', {
                item: item,
                service: service
            }, {
                size: 'sm'
            });
        }

        this.create = function(type) {
            console.info("create");
            var createTypes = {
                'element': {
                    controller: 'CreateCtrl',
                    template: '/views/modal/createScenarioElement.html'
                },
                'project': {
                    controller: 'ProjectCreateCtrl',
                    template: '/views/modal/createProject.html'
                }
            };
            dialogs.create(createTypes[type].template, createTypes[type].controller, {}, {
                size: 'sm'
            });
        }
    });