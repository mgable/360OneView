'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    updateProjects: 'ProjectsService:updateProjects',
    changeActiveItem: 'ActiveSelection:activeItemChange',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    changeViewModel: 'ViewService:modelChange',
    resetFilterBy: 'SortAndFilterService:resetFilterBy'
});
