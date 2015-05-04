var express = require('express'),
    app = express(),
    fs = require('fs'),
    cors = require('cors'),
    _ = require('underscore'),
    config = require('./config'),
    crypto = require('crypto'),
    places = {};

app.configure(function() {
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(function(req, res, next) {
        console.log('missing: ' + '%s %s', req.method, req.url);
        next();
    });
});

app.options("*", cors());

config.funcs = {
    startingScenarioId: 10000,
    scenarioCache: {},
    createProject: function (req){
        var response = _.clone(req.body);
        console.info("creating project");
        response.uuid = crypto.createHash('md5').update(response.name).digest('hex');

        response = this.addAuditInfo(response);

        places["Project listing"].push(response);
        return response;
    },
    renameProject: function(req){
        var project = this.getProject(req.body.uuid);
        project.name = req.body.name;
        project = this.addAuditInfo(project);
        if (req.body.description){
            project.description = req.body.description;
        }
        return project;
    },
    renameScenario: function(req){
        var scenario = this.getScenario(req.body.id);
        scenario.name = req.body.name;
        scenario = this.addAuditInfo(scenario);
        return scenario;
    },
    editScenario: function(req){
        var scenario = this.getScenario(req.body.id);
        scenario.description = req.body.description;
        scenario = this.addAuditInfo(scenario);
        return scenario;
    },
    createScenario: function(req){
        console.info("creating scenario");
        var response = _.clone(req.body);
        response.id = this.startingScenarioId++;
        response = this.addAuditInfo(response);
        places["scenarios"].push(response);
    },
    getProject: function(uuid){
        return _.find(places["Project listing"], function(project){
            return project.uuid == uuid;
        });
    },
    getScenario: function(id){
        return _.find(places["scenarios"], function(scenario){
            return scenario.id === id;
        });
    },
    addAuditInfo: function(response){
        response["auditInfo"] = {
          "createdOn": new Date(),
          "createdBy": {
            "uuid": "UUID-1",
            "name": "me"
          },
          "lastUpdatedOn": new Date(),
          "lastUpdatedBy": {
            "uuid": "UUID-1",
            "name": "me"
          }
        };
        return response;
    },
    getScenarios: function(req){
        var key = req.params[0], 
            results = [], 
            scenarios = _.clone(config.scenarios),
            scenarioCount;
        if (this.scenarioCache[key]){
            return this.scenarioCache[key]
        }
        scenarioCount = _.random(5);

        for(var i = 0; i < scenarioCount; i++){
            var index = _.random(scenarios.length - 1),
                scenario = scenarios.splice(index, 1)[0];
            results.push(scenario);
        }

        this.scenarioCache[key] = results;
        return results;
    },
    makeFavoriteProject: function(req){
        places["favorite projects"].push(req.body);
    },
    unfavoriteProject: function(req){
        places["favorite projects"] = _.reject(places["favorite projects"], function(favorite){
            return _.isEqual(favorite, req.query);
        });
    },
    getMembers: function(req){
        console.info("loading members");
        var fileName = "./marketshare/" + req.params.join(".") + ".json";
        return readFile(fileName);
    },
    renameView: function(req){
        var view = _.find(places["analysis-views"], function(view){
            return view.id.toString() === req.params[0];
        });
        view.name = req.body.name;
        return view;
    },
    calculationStatus: {},
    getCalculationStatus: function(req, res){
        var scenarioId = req.params[0].toString();
        console.info("the senario ID is %s", scenarioId );
        
        if (this.calculationStatus[scenarioId]  !== undefined){
            console.info("%s has been called %s times", scenarioId, this.calculationStatus[scenarioId].count);
            if (this.calculationStatus[scenarioId].output.currentState.completed === false && this.calculationStatus[scenarioId].count < 7) {
                this.calculationStatus[scenarioId].output.runningStates[this.calculationStatus[scenarioId].count].completed = true;
                this.calculationStatus[scenarioId].count++;
            } else {
                this.calculationStatus[scenarioId].output.currentState.completed = true;
                this.calculationStatus[scenarioId].output.currentState.name = "SUCCESSFUL";
            }
            return this.calculationStatus[scenarioId].output;
        } else {
            res.status(404);
        }
    },
    startCalculation: function(req, res){
        var scenarioId = req.params[0].toString();
        console.info("starting calculation of %s", scenarioId);
        this.calculationStatus[scenarioId] = {count:0, output: _.clone(this.getCalculationsFile)} ;
        console.info(this.calculationStatus[scenarioId].output);
        return this.calculationStatus[scenarioId].output;
    },
    getCalculationsFile: (function(){
        return readFile("./marketshare/calculate.json")
    })()
}

function init(config) {
    config.scenarios  = _.shuffle(loadScenarios("./marketshare/scenario.json"));

    _.each(config.places, function(place, index){
        createResponse(place, index);
    });

    function createResponse(place, index) {
        app[place.method](place.url, cors(), function(req, res) {
            sendResponse(res, loadResponses(place, req, res));
        });
    }

    function loadResponses(place, req, res){
        if(place.file){
            if (places[place.name]){
                return places[place.name]
            }
            places[place.name] = readFile(config.baseUrl + place.file);
            return places[place.name];
        } else {
            return config.funcs[place['function']](req, res);
        }
    }

    function loadScenarios(scenariosUrl){
        return readFile(config.baseUrl + scenariosUrl);
    }
}

init(config);

function readFile(file) {
    try{
        return require(file);
    }catch(e){
        return file + " not found";
    }
}

function sendResponse(res, body) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,DELETE,POST');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json');
    res.end(res.jsonp(body));
}



app.listen(3001);
console.log('listing on port 3001');