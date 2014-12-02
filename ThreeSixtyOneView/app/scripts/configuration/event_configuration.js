'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    copyScenario: 'ScenarioService:copy',
    scenarioCopied: 'ScenarioService:copyCompleted',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    updateProjects: 'ProjectsService:updateProjects',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    gotoDashboard: 'GotoService:dashboard',
    resetFilterBy: 'SortAndFilterService:resetFilterBy',
    getNewProjectTitle: "DialogService:create",
    openScenarioCreate: "DialogService:openCreateScenario",
    trayCopy: "Tray:copy",
    noop: "noop",
    // ERRORS
    noDataReceived: "ErrorService:noDataReceived",
    serverError: "ErrorService:serverError",
    error: "ErrorService:error",
    //TEST
    test: "test"
});
