var config = {};

config.places = [
{
    "name": "Create project",
    "method": "post",
    "url": "/rubix/v1/project",
    "function": "createProject"
},
// {
//     "name": "get scenarios",
//     "method": "get",
//     "url": "/rubix/v1/project/*/scenario",
//     "function": "getScenarios"
// },
// {
//     "name": "Rename project",
//     "method": "put",
//     "url": "/rubix/v1/project",
//     "function": "renameProject"
// },
// {
//     "name": "Rename scenario",
//     "method": "put",
//     "url": "/rubix/v1/project/*/scenario/name",
//     "function": "renameScenario"
// },
// {
//     "name": "Edit scenario",
//     "method": "put",
//     "url": "/rubix/v1/project/*/scenario/description",
//     "function": "editScenario"
// },
// {
//     "name": "Create scenario",
//     "method": "post",
//     "url": "/rubix/v1/project/*/scenario",
//     "function": "createScenario"
// },
// {
//     "name": "Make favorite Project",
//     "method": "post",
//     "url": "/rubix/v1/favorite/project",
//     "function": "makeFavoriteProject"
// },
// {
//     "name": "Unfavorite project",
//     "method": "delete",
//     "url": "/rubix/v1/favorite/project",
//     "function": "unfavoriteProject"
// },
// {
//     "name": "analyis-view",
//     "method": "put",
//     "url": /^\/rubix\/v1\/cube\/1\/analysis-view\/\d{1,4}$/,
//     "file": "./marketshare/analysis-view.json"
// },
// {
//     "name": "rename view",
//     "method": "put",
//     "url": /^\/rubix\/v1\/cube\/1\/analysis-view\/(\d{1,4})\/name$/,
//     "function": "renameView"
// },
// {
//     "name": "calculate",
//     "method": "post",
//     "url": "/rubix/v1/analytics/scenario/*/calculate",
//     "function": "startCalculation"
// }
];

config.baseUrl = ''

module.exports = config;