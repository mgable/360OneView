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
                "importResource": "/rubix/v1/import/analysis-element/:elementId",
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
                    "responseTranslator": {"referenceScenario": "referenceScenario", "template": "template", "title": "name", "id": "id", "description": "description", "type":"prediction.type", "createdBy":"auditInfo.createdBy.name", "createdOn": "auditInfo.createdOn", "modifiedBy":"auditInfo.lastUpdatedBy.name", "modifiedOn":"auditInfo.lastUpdatedOn"},
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
                    // "responseTranslator": {"id":"id", "name": "name", "group":"group", "cubeMeta":"cubeMeta", "title":"cubeMeta.label"},
                    // "requestTranslator": {"id":"id", "name": "title"}
                    "responseTranslator": "",
                    "requestTranslator": ""
                },
                "ScenarioAnalytics": {
                    "states": {
                        "FAILED": {
                            "message": "FAILED",
                            "description": "Calculation Failed",
                            "icon": "failed"
                        },
                        "NOT_CALCULATED": {
                            "message": "not_calculated",
                            "description": "Scenario has not been calculated",
                            "icon": "not_calculated"
                        },
                        "SUCCESS": {
                            "message": "SUCCESSFUL",
                            "description": "Calculation succeed",
                            "icon": "successful"
                        },
                        "IN_PROGRESS": {
                            "message": "in_progress",
                            "description": "Simulation is in progress",
                            "icon": "in_progress"
                        }
                    },
                },
                "ImportModel": {
                    "uploadStates": {
                        "success": {
                            "message": "IMPORT_REQUEST_ACCEPTED",
                            "description": "Upload successful.",
                            "code": 201
                        },
                        "fail": {
                            "message": "FILE_UPLOAD_FAILED",
                            "description": "File upload failed, please try again.",
                            "code": 400
                        },
                        "empty": {
                            "message": "EMPTY_FILE_IMPORTED",
                            "description": "Uploaded file is empty.",
                            "code": 400
                        }
                    },
                    "importStates": {
                        "init": {
                            "message": "INIT",
                            "description": "Initializing the import process ...",
                            "code": 201
                        },
                        "success": {
                            "message": "COMPLETED",
                            "description": "Import completed.",
                            "code": 201
                        },
                        "inprogress": {
                            "message": "IN_PROGRESS",
                            "description": "Processing the imported file ...",
                            "code": 201
                        },
                        "fail": {
                            "message": "FAILED",
                            "description": "Processing the uploaded file failed, please try again.",
                            "code": 400
                        },
                        "notfound": {
                            "message": "IMPORT_REQUEST_NOT_FOUND",
                            "description": "Import request was not found.",
                            "code": 201 // for now the code is changed to 201 in the back-end
                        }
                    },
                    "acceptedFileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                },
                "ExportModel": {
                    "exportStates": {
                        "success": {
                            "message": "EXPORT_REQUEST_ACCEPTED",
                            "description": "Initializing the export process ...",
                            "code": 201
                        }
                    },
                    "processingStates": {
                        "init": {
                            "message": "INIT",
                            "description": "Initializing the export process ...",
                            "code": 201
                        },
                        "complete": {
                            "message": "COMPLETED",
                            "description": "Export process completed, initializing the download process ...",
                            "code": 201
                        },
                        "inprogress": {
                            "message": "IN_PROGRESS",
                            "description": "Preparing the file to download ...",
                            "code": 201
                        },
                        "fail": {
                            "message": "FAILED",
                            "description": "Export failed, please try again.",
                            "code": 400
                        },
                        "download": {
                            "message": "DOWNLOADED",
                            "description": "File downloaded successfully.",
                            "code": 201
                        },
                        "notfound": {
                            "message": "EXPORT_REQUEST_NOT_FOUND",
                            "description": "Export request was not found.",
                            "code": 201 // for now the code is changed to 201 in the back-end
                        }
                    }
                },
                "PivotServiceModel": {
                    "pivotDataStatus": {
                        "saved": {"status": "Data saved successfully."},
                        "saving": {"status": "Saving data ..."},
                        "loaded": {"status": "Data loaded successfully."},
                        "loading": {"status": "Loading data ..."},
                        "empty": {"status": "No data for selected filters."}
                    }
                }
            },
            "inputRestrictions": {
                "characterRestrictions": /^[^\\\/\?\:\*"><|]+$/,
                "minimumCharacterLimit": 2,
                "maximumCharacterLimit": 256
            }
        },
        "view": {
            "Dashboard": {
                "orderBy": 'modifiedOn',
                "reverse": true,
                "favoriteType": "scenario",
                "nameClickAction": "gotoScenarioEdit",
                "alertSrc": "views/includes/display/no_scenarios_alert.tpl.html",
                "displayActionsCreate": "gotoScenarioCreate",
                "renameAction": "renameScenario",
                "editAction": "editScenario",
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
                "editAction": "renameProject",
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
                "timerInterval": 10000
            },
            "PivotTable": {
                "size": {
                    "minColumnWidth": 150,
                    "maxColumnWidth": 250,
                    "rowHeight": 40
                },
                "color": {
                    "msPureWhite": "#fff",
                    "msLightGray": "#e6e6e6",
                    "msMediumLightGray": "#cdcdcd",
                    "msMediumGray": "#999",
                    "msBlack": "#333",
                    "msSelectionColor": "rgba(229, 229, 229, 0.3)"
                },
                "font": {
                    "headerFontStyle": "14px proxima-nova, arial, sans-serif",
                    "cellFontStyle": "14px proxima-nova, arial, sans-serif"
                }
            },
            "ScenarioTemplates": {
                "workflow" : [
                    {url: "name_and_describe.tpl.html", label: "Name & Describe", id: 0},
                    {url: "choose_dimensions.tpl.html", label: "Choose Dimensions",id: 1},
                    {url: "choose_defaults.tpl.html", label: "Choose Defaults", id: 2},
                    {url: "review.tpl.html", buttonLabel: "DONE", label: "Review", id: 3}
                ]
            }
        },
        "client": {
            "name": "Ford"
        }
    });