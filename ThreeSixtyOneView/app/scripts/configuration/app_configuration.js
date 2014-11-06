'use strict';

angular.module('ThreeSixtyOneView.config')
.constant('CONFIG', {
        "application": {
            // application level data here
            "api": {
                "projects": "/rubix/v1/project",
                "favorites": "/rubix/v1/favorite/project/",
                "scenarios": "/rubix/v1/project/:id/scenario",
                "cube": "/rubix/v1/model/cube/:id",
                "pivotview": "/rubix/v1/cube/:cubeId/analysis-view/:viewId"
            },
            "models": {
                "ProjectsModel": {
                    // want: get
                    "responseTranslator": {"isMaster": "isMaster", "id" : "uuid", "title": "name", "description": "description", "createdBy":{"selector":"auditInfo.createdBy.name"}, "createdOn":{"selector":"auditInfo.createdOn"}, "modifiedBy":{"selector":"auditInfo.lastUpdatedBy.name"}, "modifiedOn":{"selector":"auditInfo.lastUpdatedOn"}},
                    // want: get
                    "requestTranslator": {"uuid" : "id", "name": "title", "description": "description", "isMaster": "isMaster"},
                    "newProject": {"title": "","description" : "", "isMaster": false}
                },
                "ScenarioModel": {
                    // want: get
                    "responseTranslator": {"referenceScenario": "referenceScenario", "title": "name", "id": "id", "description": "description", "type":{"selector":"prediction.type"}, "createdBy":{"selector":"auditInfo.createdBy.name"}, "createdOn":{"selector":"auditInfo.createdOn"}, "modifiedBy":{"selector":"auditInfo.lastUpdatedBy.name"}, "modifiedOn":{"selector":"auditInfo.lastUpdatedOn"}},
                    "requestTranslator": {"name":"title", "referenceScenario": "referenceScenario", "description": "description", "prediction.type": "type"},
                    "newScenario": {"title" : "", "description": "","referenceScenario": {"id": 1, "name": "PRE LOADED SIMULATION NEW"}, "type": "Simulation"}
                },
                "CubeModel" : {
                    "responseTranslator": "",
                    "requestTranslator": ""
                },
                "FavoritesModel" : {
                    "responseTranslator": "",
                    "requestTranslator": ""
                }
            },
            "inputRestrictions": {
                "characterRestrictions": /^[^\\\/\?\:\*"><|]+$/,
                "minimumCharacterLimit": 2,
                "maximumCharacterLimit": 256
            }
        },
        "session": {
            // session level data here
        },
        "view": {
            "Dashboard": {
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.Dashboard.filterMenu.items[0]',
                "reverse": true,
                "nameClickAction": "gotoScenarioEdit",
                "alertSrc": "views/includes/no_scenarios_alert.tpl.html",
                "displayActionsCreate": "gotoScenarioCreate",
                "trayActions": {
                    "copy": "trayCopy",
                    "share": "noop",
                    "archive": "noop",
                    "dropdown": "noop"
                },
                "filterMenu": {
                    "firstSelected": 0,
                    "title": "Scenarios",
                    "icon": "database",
                    "items": [{
                        "label": "all scenarios",
                        "filterType": "activeFilter",
                        "filter" : {}
                    }]
                },
                "sortMenu": {
                    "displayColumns": [{
                        "label": "Last Modified",
                        "filter": "modifiedOn"
                    }, {
                        "label": "Type",
                        "filter": "type"
                    },
                    {
                        "label": "Created Date",
                        "filter": "createdOn"
                    }]
                },
            },
            "ProjectManager": {
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.ProjectManager.filterMenu.items[0]',
                "reverse": true,
                "hasFavorites": true,
                "nameClickAction": 'gotoDashboard',
                "displayActionsCreate": "openCreateProject",
                 "trayActions": {
                    "copy": "noop",
                    "share": "noop",
                    "archive": "noop",
                    "dropdown": "noop"
                },
                "filterMenu": {
                    "firstSelected": 0,
                    "icon": "suitcase",
                    "title": "Projects",
                    "items": [{
                        "label": "All Projects",
                        "filterType": "activeFilter",
                        "filter": {}
                    }, {
                        "label": "Favorites",
                        "filterType": "filterPipeline",
                        "filter": "isFavorite"
                    }]
                },
                "sortMenu": {
                    "displayColumns": [{
                        "label": "Last Modified",
                        "filter": "modifiedOn"
                    },
                    {
                        "label": "Created Date",
                        "filter": "createdOn"
                    }]
                }
            },
            "Scenario": {
                "cubeId": 1
            }
        },
        "user": {
            "name": "me",
            "role": "default user"
        }
    });