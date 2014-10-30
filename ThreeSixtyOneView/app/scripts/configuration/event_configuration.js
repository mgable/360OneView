'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    updateBaseScenario: 'ScenarioService:updateBaseScenario',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    updateProjects: 'ProjectsService:updateProjects',
    changeActiveItem: 'ActiveSelection:activeItemChange',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    gotoDashboard: 'GotoService:dashboard',
    resetFilterBy: 'SortAndFilterService:resetFilterBy',
    openCreateProject: "DialogService:openCreateProject",
    // ERRORS
    noDataReceived: "ErrorService:noDataReceived",
    serverError: "ErrorService:serverError"
});
