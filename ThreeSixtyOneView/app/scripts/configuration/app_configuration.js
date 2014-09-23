'use strict';

angular.module('ThreeSixtyOneView.config')
.constant('CONFIG', {
        "application": {
            // application level data here
            "api": {
                "projects": "/rubix/v1/project",
                "favorites": "/rubix/v1/favorite/project/"
            },
            "models": {
                "ProjectsModel": {
                    "translator": {"isMaster": "isMaster", "id" : "uuid", "title": "name", "description": "description", "createdBy":{selector:"['auditInfo']['createdBy']['name']"}, "createdOn":{selector:"['auditInfo']['createdOn']"}, "modifiedBy":{selector:"['auditInfo']['lastUpdatedBy']['name']"}, "modifiedOn":{selector:"['auditInfo']['lastUpdatedOn']"}}
                }
            }
        },
        "session": {
            // session level data here
        },
        "view": {
            "Dashboard": {
                "model": "ProjectsModel",
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.Dashboard.filterMenu.items[0]',
                "reverse": true,
                "topInclude": "views/includes/dashboard_top.tpl.html",
                "status": true,
                "where": "gotoScenarioEdit",
                "displayActionsCreate": "scope.$emit('scenario:create')",
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
                        "label": "Modified By",
                        "filter": "modifiedBy",
                        "filters": [{
                            "label": "Modified by me",
                            "filter": "modifiedBy",
                            "who": "me"
                        }, {
                            "label": "Modified by:",
                            "filter": "modifiedBy",
                            "who": "name"
                        }],
                        "template": "views/directives/name.tpl.html",
                        "enabledOn": "Modified by:"
                    }, {
                        "label": "Creator",
                        "filter": "createdBy",
                        "filters": [{
                            "label": "Created by me",
                            "filter": "createdBy",
                            "who": "me"
                        }, {
                            "label": "Created by:",
                            "filter": "createdBy",
                            "who": "name"
                        }],
                        "template": "views/directives/name.tpl.html",
                        "enabledOn": "Created by:"
                    }]
                },
                "contextualMenu": {
                    'actions': [
                        {'name':'base', 'label': "use as base for a new scenario"},
                        {'name':'copy', 'label': "copy as a new scenario", config: {title: 'Copy Scenario', description: '', submit: {'label':"copy as new scenario"}, cancel: {'label':'cancel'}}},
                        {'name':'set', 'label': "set as current plan"},
                        {'name': 'rename'},
                        {'name': 'archive'},
                        {'name': 'details'}
                    ],
                    'views': {
                        "defaults": {
                            "type": "master",
                            "value": "010001"
                        },
                        "otherwise": "111111"
                    }
                }
            },
            "ProjectManager": {
                "model": "ProjectsModel",
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.ProjectManager.filterMenu.items[0]',
                "reverse": true,
                "hasFavorites": true,
                "status": false,
                "where": 'gotoDashboard',
                "displayActionsCreate": "scope.DiaglogService.create('project')",
                "newProject": {
                    "name": "",
                    "description" : "",
                    "isMaster": false
                },
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
                    // ,{
                    //     "label": "Created by me",
                    //     "filterType": "activeFilter",
                    //     "filter": {
                    //         "createdBy": "me"
                    //     }
                    // }
                    ]
                },
                "contextualMenu": {
                    "actions": [
                        {'name':'copy', config: {title: 'Copy Project', description: 'xxxxxxxxxxxxx', submit: {label:"copy"}, cancel: {label:'cancel'}}},
                        {'name':'favorites', label: "favorite"},
                        {'name':'sharing'},
                        {'name':'rename'},
                        {'name':'archive'},
                        {'name':'add'},
                        {'name':'details'}
                    ],
                    "views": {
                        "isMaster": {
                            "type": true,
                            "value": "0000001"
                        },
                        "otherwise": "0101001"
                    }
                },
                "sortMenu": {
                    "displayColumns": [{
                        "label": "Last Modified",
                        "filter": "modifiedOn"
                    }, {
                        "label": "Modified By",
                        "filter": "modifiedBy",
                        "filters": [{
                            "label": "Modified by me",
                            "filter": "modifiedBy",
                            "who": "me"
                        }, {
                            "label": "Modified by:",
                            "filter": "modifiedBy",
                            "who": "name"
                        }],
                        "template": "views/directives/name.tpl.html",
                        "enabledOn": "Modified by:"
                    }, {
                        "label": "Creator",
                        "filter": "createdBy",
                        "filters": [{
                            "label": "Created by me",
                            "filter": "createdBy",
                            "who": "me"
                        }, {
                            "label": "Created by:",
                            "filter": "createdBy",
                            "who": "name"
                        }],
                        "template": "views/directives/name.tpl.html",
                        "enabledOn": "Created by:"
                    }]
                }
            }
        },
        "user": {
            "name": "me",
            "role": "default user"
        }
    });