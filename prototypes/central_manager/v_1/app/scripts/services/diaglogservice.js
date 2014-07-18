'use strict';

angular.module('centralManagerApp')
    .service('DiaglogService', function(InfoTrayService, FileDeleteService, FilesModel, dialogs) {
        this.trash = function(item) {
            if (item) {
                FileDeleteService.setFilesToDelete([item]);
            }
            dialogs.create('/views/modal/delete.html', 'DeleteCtrl', InfoTrayService.closeInfoTray);
        }

        this.copy = function(item) {
            var dlg = dialogs.confirm("Copy Entity", "Do you want to copy " + item.title + "?");
            dlg.result.then(
                function(btn) {
                    console.info(btn);
                    FilesModel.$clone(item.id);
                },
                function(btn) {
                    console.info(btn)
                }
            )
        }

        this.rename = function(item) {
            dialogs.create('/views/modal/rename.html', 'RenameCtrl', item, {
                size: 'sm'
            });
        }

        this.create = function() {
            console.info("create")
            dialogs.create('/views/modal/create.html', 'CreateCtrl', {}, {
                size: 'sm'
            });
        }
    });