var config = {};

config.places = [{
    "type": "Project listing",
    "url": "/rubix/v1/project",
    "file": "./marketshare/project.json"
},
{
    "type": "favorite projects",
    "url": "/rubix/v1/favorite/project",
    "file": "./marketshare/favorites.json"
},
{
    "type": "scenarios",
    "url": "/rubix/v1/project/*/scenario",
    "file": "./marketshare/scenario.json"
},
{
    "type": "favorite scenarios",
    "url": "/rubix/v1/favorite/project/*/scenario",
    "file": "./marketshare/favorite_scenarios.json"
},
{
    "type": "scenario calculate",
    "url": "/rubix/v1/analytics/scenario/*/calculate",
    "file": "./marketshare/favorite_scenarios.json"
},
{
    "type": "analysis elements",
    "url": "/rubix/v1/analytics/scenario/*",
    "file": "./marketshare/analysis_elements.json"
},
{
    "type": "analysis element",
    "url": "/rubix/v1/scenario/*/analysis-element",
    "file": "./marketshare/analysis_element.json"
}

];

config.baseUrl = ''

module.exports = config;