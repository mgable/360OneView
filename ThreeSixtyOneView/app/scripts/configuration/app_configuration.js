'use strict';

angular.module('ThreeSixtyOneView.config')
.constant('CONFIG', {
        "application": {
            // application level data here
            "api": {
                "projects": "/rubix/v1/project",
                "favorites": "/rubix/v1/favorite",
                "scenarios": "/rubix/v1/project/:id/scenario",
                "cube": "/rubix/v1/model/cube/:id",
                "pivotview": "/rubix/v1/cube/:cubeId/analysis-view/:viewId",
                "pivotdata": "/rubix/v1/pivot/analysis-element/:elementId/analysis-view/:viewId",
                "scenarioElement": "/rubix/v1/scenario/:id",
                "scenarioAnalytics": "/rubix/v1/analytics/scenario/:id/calculate",
                "upload": "/rubix/v1/import",
                "exportResource": "/rubix/v1/export/analysis-element/:elementId",
                "reports": "/rubix/v1/reports/analysis-element/:elementId/analysis-view/:viewId/summary"
            },
            "models": {
                "ProjectsModel": {
                    // want: get
                    "responseTranslator": {"isMaster": "isMaster", "id" : "uuid", "title": "name", "description": "description", "createdBy": "auditInfo.createdBy.name", "createdOn":"auditInfo.createdOn", "modifiedBy":"auditInfo.lastUpdatedBy.name", "modifiedOn": "auditInfo.lastUpdatedOn"},
                    // want: get
                    "requestTranslator": {"uuid" : "id", "name": "title", "description": "description", "isMaster": "isMaster"},
                    "newProject": {"title": "","description" : "", "isMaster": false}
                },
                "ScenarioModel": {
                    // want: get
                    "responseTranslator": {"referenceScenario": "referenceScenario", "title": "name", "id": "id", "description": "description", "type":"prediction.type", "createdBy":"auditInfo.createdBy.name", "createdOn": "auditInfo.createdOn", "modifiedBy":"auditInfo.lastUpdatedBy.name", "modifiedOn":"auditInfo.lastUpdatedOn"},
                    "requestTranslator": {"id": "id", "name":"title", "referenceScenario": "referenceScenario", "description": "description", "prediction.type": "type"},
                    "newScenario": {"title" : "", "description": "","referenceScenario": {"id": "", "name": ""}, "type": "Simulation"}
                },
                "MetaDataModel" : {
                    "responseTranslator": "",
                    "requestTranslator": ""
                },
                "FavoritesModel" : {
                    "responseTranslator": "",
                    "requestTranslator": ""
                },
                "ScenarioElement": {
                    "responseTranslator": {"id":"id", "name": "name", "group":"group", "cubeMeta":"cubeMeta", "title":"cubeMeta.label"},
                    "requestTranslator": {"id":"id", "name": "title"}
                },
                "ScenarioAnalytics": {
                    "states" : {
                        "NOT_CALCULATED": "not_calculated",
                        "FAILED": "FAILED",
                        "SUCCESS": "SUCCESSFUL",
                        "IN_PROGRESS": "in_progress"
                    }
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
                "reverse": true,
                "favoriteType": "scenario",
                "nameClickAction": "gotoScenarioEdit",
                "alertSrc": "views/includes/no_scenarios_alert.tpl.html",
                "displayActionsCreate": "gotoScenarioCreate",
                "renameAction": "renameScenario",
                "trayButtons": [{
                    "action": "trayCopy",
                    "label": "copy",
                    "icon": "files-o"
                }],
                "filterMenu": {
                    "firstSelected": 0,
                    "title": "Scenarios",
                    "icon": "database",
                    "items": [{
                        "label": "all scenarios",
                        "filterType": "activeFilter",
                        "filter" : {}
                    },{
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
                    // {
                    //     "label": "Type",
                    //     "filter": "type"
                    // },
                    {
                        "label": "Created Date",
                        "filter": "createdOn"
                    }]
                },
            },
            "ProjectManager": {
                "orderBy": 'modifiedOn',
                "reverse": true,
                "favoriteType": "project",
                "nameClickAction": 'gotoDashboard',
                "displayActionsCreate": "getNewProjectTitle",
                "renameAction": "renameProject",
                "trayButtons": [],
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
            "ScenarioCalculate": {
                "timerInterval": 10000,
                "statusLen": 7
            }
        },
        "user": {
            "name": "me",
            "role": "default user"
        }
    });