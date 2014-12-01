'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    copyScenario: 'ScenarioService:copy',
    scenarioCopied: 'ScenarioService:copyCompleted',
    updateBaseScenario: 'ScenarioService:updateBaseScenario',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    updateProjects: 'ProjectsService:updateProjects',
    changeActiveItem: 'ActiveSelection:activeItemChange',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    gotoDashboard: 'GotoService:dashboard',
    resetFilterBy: 'SortAndFilterService:resetFilterBy',
    openCreateProject: "DialogService:openCreateProject",
    openScenarioCreate: "DialogService:openCreateScenario",
    trayCopy: "Tray:copy",
    noop: "noop",
    // ERRORS
    noDataReceived: "ErrorService:noDataReceived",
    serverError: "ErrorService:serverError",
    error: "ErrorService:error",
    // TEST
    test: "test",
    // PIVOT TABLE
    heightChanged: "heightChanged"
});
