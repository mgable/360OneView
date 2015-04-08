'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    copyScenario: 'ScenarioService:copy',
    scenarioCopied: 'ScenarioService:copyCompleted',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    editScenario: 'ScenarioService:edit',
    updateProjects: 'ProjectsService:updateProjects',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    gotoDashboard: 'GotoService:dashboard',
    filter: 'SortAndFilterService:filter',
    getNewProjectTitle: "DialogService:create",
    openScenarioCreate: "DialogService:openCreateScenario",
    newSelectedItem: "ListingView:newSelectedItem",
    trayCopy: "Tray:copy",
    changePivotTableFilter: "PivotTable:changeFilter",
    tabClosed: "TabControl:closeAll",
    noop: "noop",
    // Scenario editor and results
    scenarioElementChange: "PivotBuilderCtrl:loadCube",
    pivotTableStatusChange: "ScenarioCtrl:pivotTableStatusChange",
    pivotViewChange: "PivotBuilderCtrl:pivotViewChange",
    // ERRORS
    noDataReceived: "ErrorService:noDataReceived",
    serverError: "ErrorService:serverError",
    error: "ErrorService:error",
    // TEST
    test: "test",
    // PIVOT TABLE
    heightChanged: "heightChanged",
    // BROADCAST STATES
    broadcastStates: "broadcastStates",
    // FLIPBOOK
    moveForward: 'moveForward',
    scenarioTemplatesAdvance: 'scenarioTemplatesAdvance'
});
