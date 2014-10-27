'use strict';

angular.module('ThreeSixtyOneView.config')
.constant('CONFIG', {
        "application": {
            // application level data here
            "api": {
                "projects": "/rubix/v1/project",
                "favorites": "/rubix/v1/favorite/project/",
                "scenarios": "/rubix/v1/project/:id/scenario",
                "cube": "/rubix/v1/model/cube/:id"
            },
            "models": {
                "ProjectsModel": {
                    // want: get
                    "responseTranslator": {"isMaster": "isMaster", "id" : "uuid", "title": "name", "description": "description", "createdBy":{"selector":"['auditInfo']['createdBy']['name']"}, "createdOn":{"selector":"['auditInfo']['createdOn']"}, "modifiedBy":{"selector":"['auditInfo']['lastUpdatedBy']['name']"}, "modifiedOn":{"selector":"['auditInfo']['lastUpdatedOn']"}},
                    // want: get
                    "requestTranslator": {"uuid" : "id", "name": "title", "description": "description", "isMaster": "isMaster"},
                    "newProject": {"title": "","description" : "", "isMaster": false}
                },
                "ScenarioModel": {
                    // want: get
                    "responseTranslator": {"referenceScenario": "referenceScenario", "title": "name", "id": "id", "description": "description", "type":{"selector":"['prediction']['type']"}, "createdBy":{"selector":"['auditInfo']['createdBy']['name']"}, "createdOn":{"selector":"['auditInfo']['createdOn']"}, "modifiedBy":{"selector":"['auditInfo']['lastUpdatedBy']['name']"}, "modifiedOn":{"selector":"['auditInfo']['lastUpdatedOn']"}},
                    "requestTranslator": {"name":"title", "referenceScenario": "referenceScenario", "description": "description", "prediction": "prediction"},
                    "newScenario": {"title" : "", "description": "","referenceScenario": {"id": 1, "name": "PRE LOADED SIMULATION NEW"}, "prediction" : {"type" : "Simulation"}}
                },
                "CubeModel" : {
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
                "model": "ScenarioService",
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.Dashboard.filterMenu.items[0]',
                "reverse": true,
                "topInclude": "views/includes/dashboard_top.tpl.html",
                "where": "gotoScenarioEdit",
                "alertSrc": "views/includes/no_scenarios_alert.tpl.html",
                "displayActionsCreate": "gotoScenarioCreate",
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
                "model": "ProjectsModel",
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.ProjectManager.filterMenu.items[0]',
                "reverse": true,
                "hasFavorites": true,
                "where": 'gotoDashboard',
                "displayActionsCreate": "openCreateProject",
                "filterMenu": {
                    "firstSelected": 0,
                    "icon": "suitcase",
                    "title": "Projects",
                    "items": [{
                        "label": "All",
                        "filterType": "activeFilter",
                        "filter": {}
                    }, {
                        "label": "Favorites",
                        "filterType": "filterPipeline",
                        "filter": "isFavorite"
                    }
                    ,{
                        "label": "Created by Me",
                        "filterType": "activeFilter",
                        "filter": {
                            "createdBy": "me"
                        }
                    }
                    ]
                },
                "sortMenu": {
                    "displayColumns": [{
                        "label": "Last Modified",
                        "filter": "modifiedOn"
                    },
                    {
                        "label": "Created Date",
                        "filter": "createdOn"
                    }
                    // {
                    //     "label": "Modified By",
                    //     "filter": "modifiedBy",
                    //     "filters": [{
                    //         "label": "Modified by me",
                    //         "filter": "modifiedBy",
                    //         "who": "me"
                    //     }, 
                    //     {
                    //         "label": "Modified by:",
                    //         "filter": "modifiedBy",
                    //         "who": "name"
                    //     }],
                    //     "template": "views/directives/name.tpl.html",
                    //     "enabledOn": "Modified by:"
                    // }, 
                    // {
                    //     "label": "Creator",
                    //     "filter": "createdBy",
                    //     "filters": [{
                    //         "label": "Created by me",
                    //         "filter": "createdBy",
                    //         "who": "me"
                    //     }, {
                    //         "label": "Created by:",
                    //         "filter": "createdBy",
                    //         "who": "name"
                    //     }],
                    //     "template": "views/directives/name.tpl.html",
                    //     "enabledOn": "Created by:"
                    // }
                    ]
                }
            }
        },
        "user": {
            "name": "me",
            "role": "default user"
        }
    });