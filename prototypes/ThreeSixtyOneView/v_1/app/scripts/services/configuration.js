'use strict';

angular.module('ThreeSixtyOneView')
.constant('CONFIG', {
        "application": {
            // application level data here
            "api": {
                "projects": "/rubix/v1/project"
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
                        "template": "/name.html",
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
                        "template": "/name.html",
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
            "CentralManager": {
                "model": "FilesModel",
                "orderBy": 'lastModified',
                "filter": 'CONFIG.view.CentralManager.filterMenu.items[0]',
                "reverse": true,
                "favorites": false,
                "filterMenu": {
                    firstSelected: 0,
                    title: "Scenario Elements",
                    icon: "cog",
                    items: [{
                        label: "defaults",
                        filterType: "activeFilter",
                        filter: {
                            "defaults": true
                        }
                    }, {
                        label: "Economy",
                        filterType: "activeFilter",
                        filter: {
                            type: "Economy"
                        }
                    }, {
                        label: "Competition",
                        filterType: "activeFilter",
                        filter: {
                            type: "Competition"
                        }
                    }, {
                        label: "Labor Cost",
                        filterType: "activeFilter",
                        filter: {
                            type: "Labor Cost"
                        }
                    }, {
                        label: "Pricing",
                        filterType: "activeFilter",
                        filter: {
                            type: "Pricing"
                        }
                    }, {
                        label: "Cost Assumptions",
                        filterType: "activeFilter",
                        filter: {
                            type: "Cost Assumptions"
                        }
                    }]
                },
                "contextualMenu": {
                    actions: [
                        {'name': 'copy'}, 
                        {'name':'sharing'}, 
                        {'name':'rename'}, 
                        {'name':'archive'}, 
                        {'name':'add'}, 
                        {'name':'details'}
                    ],
                    views: {
                        "defaults": {
                            "type": "master",
                            "value": "100001"
                        },
                        "access": {
                            "type": "view only",
                            "value": "100001"
                        },
                        "otherwise": "101101"
                    }
                },
                "sortMenu": {
                    "displayColumns": [{
                        "label": "Last Modified",
                        "filter": "lastModified"
                    }, {
                        "label": "Modified By",
                        "filter": "modifiedBy",
                        "filters": [{
                            "label": "Modified by me",
                            "filter": "modifiedBy"
                        }, {
                            "label": "Modified by:",
                            "filter": "modifiedBy"
                        }],
                        "template": "/name.html",
                        "enabledOn": "Modified by:"
                    }, {
                        "label": "Owner",
                        "filter": "owner",
                        "filters": [{
                            "label": "Owned by me",
                            "filter": "owner"
                        }, {
                            "label": "Owned by:",
                            "filter": "owner"
                        }],
                        "template": "/name.html",
                        "enabledOn": "Owned by:"
                    }]
                }
            },
            "ProjectManager": {
                "model": "ProjectsModel",
                "orderBy": 'modifiedOn',
                "filter": 'CONFIG.view.ProjectManager.filterMenu.items[0]',
                "reverse": true,
                "favorites": true,
                "status": false,
                "where": 'gotoDashboard',
                "filterMenu": {
                    "firstSelected": 0,
                    "icon": "suitcase",
                    "title": "Projects",
                    "items": [{
                        label: "All",
                        filterType: "activeFilter",
                        filter: {}
                    }, {
                        label: "Favorites",
                        filterType: "filterPipeline",
                        filter: "isFavorite"
                    }, {
                        label: "Created by me",
                        filterType: "activeFilter",
                        filter: {
                            createdBy: "me"
                        }
                    }, {
                        label: "I can edit",
                        filterType: "activeFilter",
                        filter: {
                            access: "Everyone can edit"
                        }
                    }]
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
                        "otherwise": "1101101"
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
                        "template": "/name.html",
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
                        "template": "/name.html",
                        "enabledOn": "Created by:"
                    }]
                }
            }
        },
        "user": {
            "name": "me",
            "role": "default user",
            "favorites": []
        }
    });