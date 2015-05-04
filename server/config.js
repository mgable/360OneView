var config = {};

config.places = [{
    "name": "Project listing",
    "method": "get",
    "url": "/rubix/v1/project",
    "file": "./marketshare/project.json"
},
{
    "name": "Create project",
    "method": "post",
    "url": "/rubix/v1/project",
    "function": "createProject"
},
{
    "name": "Rename project",
    "method": "put",
    "url": "/rubix/v1/project",
    "function": "renameProject"
},
{
    "name": "Rename scenario",
    "method": "put",
    "url": "/rubix/v1/project/*/scenario/name",
    "function": "renameScenario"
},
{
    "name": "Edit scenario",
    "method": "put",
    "url": "/rubix/v1/project/*/scenario/description",
    "function": "editScenario"
},
{
    "name": "favorite projects",
    "method": "get",
    "url": "/rubix/v1/favorite/project",
    "file": "./marketshare/favorites.json"
},
{
    "name": "scenarios",
    "method": "get",
    "url": "/rubix/v1/project/*/scenario",
    "function": "getScenarios"
},
{
    "name": "Create scenario",
    "method": "post",
    "url": "/rubix/v1/project/*/scenario",
    "function": "createScenario"
},
{
    "name": "favorite scenarios",
    "method": "get",
    "url": "/rubix/v1/favorite/project/*/scenario",
    "file": "./marketshare/favorite_scenarios.json"
},
{
    "name": "Make favorite Project",
    "method": "post",
    "url": "/rubix/v1/favorite/project",
    "function": "makeFavoriteProject"
},
{
    "name": "Unfavorite project",
    "method": "delete",
    "url": "/rubix/v1/favorite/project",
    "function": "unfavoriteProject"
},
{
    "name": "analysis elements",
    "method": "get",
    "url": /^rubix\/v1\/analytics\/scenario\/\d{4}$/,
    "file": "./marketshare/analysis_elements.json"
},
{
    "name": "analysis element",
    "method": "get",
    "url": "/rubix/v1/scenario/*/analysis-element",
    "file": "./marketshare/analysis_element.json"
},
{
    "name": "cube meta",
    "method": "get",
    "url": "/rubix/v1/model/cube/*/meta",
    "file": "./marketshare/cube_meta.json"
},
{
    "name" : "cube meta members",
    "method": "get",
    "url": /rubix\/v1\/model\/cube\/(\d{1,3})\/dimension\/(\d{1,3})\/hierarchy\/(\d{1,3})\/level\/(\d{1,3})\/members/,
    "function": "getMembers"
},
{
    "name": "analysis-views",
    "method": "get",
    "url": "/rubix/v1/cube/*/analysis-view",
    "file": "./marketshare/analysis-views.json"
},
{
    "name": "analyis-view",
    "method": "get",
    "url": /rubix\/v1\/cube\/1\/analysis-view\/\d{1,4}/,
    "file": "./marketshare/analysis-view.json"
},
{
    "name": "analyis-view",
    "method": "put",
    "url": /^\/rubix\/v1\/cube\/1\/analysis-view\/\d{1,4}$/,
    "file": "./marketshare/analysis-view.json"
},
{
    "name": "rename view",
    "method": "put",
    "url": /^\/rubix\/v1\/cube\/1\/analysis-view\/(\d{1,4})\/name$/,
    "function": "renameView"
},
{
    "name": "slice",
    "method": "get",
    "url": /rubix\/v1\/pivot\/analysis-element\/\d{1,3}\/analysis-view\/\d{1,4}\/slice/,
    "file": "./marketshare/slice.json"
},
{
    "name": "calculate",
    "method": "post",
    "url": "/rubix/v1/analytics/scenario/*/calculate",
    "function": "startCalculation"
},
{
    "name": "calculate",
    "method": "get",
    "url": /rubix\/v1\/analytics\/scenario\/(\d{1,4})\/calculate/,
    "function": "getCalculationStatus"
},
{
    "name": "summary",
    "method": "get",
    "url": "/rubix/v1/reports/analysis-element/*/analysis-view/*/summary",
    "file": "./marketshare/summary.json"
}
];

config.baseUrl = ''

module.exports = config;