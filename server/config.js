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
    "name": "favorite projects",
    "method": "get",
    "url": "/rubix/v1/favorite/project",
    "file": "./marketshare/favorites.json"
},
{
    "name": "scenarios",
    "method": "get",
    "url": "/rubix/v1/project/*/scenario",
    "file": "./marketshare/scenario.json"
},
{
    "name": "favorite scenarios",
    "method": "get",
    "url": "/rubix/v1/favorite/project/*/scenario",
    "file": "./marketshare/favorite_scenarios.json"
},
// {
//     "name": "scenario calculate",
//     "url": "/rubix/v1/analytics/scenario/*/calculate",
//     "file": "./marketshare/favorite_scenarios.json"
// },
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