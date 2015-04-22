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
}

];

config.baseUrl = ''

module.exports = config;