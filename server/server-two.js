var express = require('express'),
    app = express(),
    fs = require('fs'),
    cors = require('cors'),
    _ = require('underscore'),
    config = require('./config'),
    crypto = require('crypto'),
    cache = {};

app.options("*", cors());

app.get('*', cors(),  function(req, res, next){
    var responseData = loadResponses(req.url, req, res, next);
    if (responseData){
        sendResponse(res, responseData);
    } else {
        console.info("there!!!");
        next();
    }
}, set404);

config.funcs = {
    startingScenarioId: 10000,
    scenarioCache: {},
    createProject: function (req){
        var response = _.clone(req.body);
        console.info("creating project");
        response.uuid = crypto.createHash('md5').update(response.name).digest('hex');

        response = this.addAuditInfo(response);

        //cache["/rubix/v1/project"].push(response);
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
        cache["scenarios"].push(response);
    },
    getProject: function(uuid){
        return _.find(cache["Project listing"], function(project){
            return project.uuid == uuid;
        });
    },
    getScenario: function(id){
        return _.find(cache["scenarios"], function(scenario){
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
    getScenarios: function(){
        return [];
    },
    makeFavoriteProject: function(req){
        cache["favorite projects"].push(req.body);
    },
    unfavoriteProject: function(req){
        cache["favorite projects"] = _.reject(cache["favorite projects"], function(favorite){
            return _.isEqual(favorite, req.query);
        });
    },
    getMembers: function(req){
        console.info("loading members");
        var fileName = "./marketshare/" + req.params.join(".") + ".json";
        return readFile(fileName);
    },
    renameView: function(req){
        var view = _.find(cache["analysis-views"], function(view){
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

    _.each(config.places, function(place, index){
        console.info("creating " + place.name);
        createResponse(place, index);
    });

    function createResponse(place, index) {
        app[place.method](place.url, cors(), function(req, res, next) {
            sendResponse(res, loadFunctions(place, req, res, next));
        }, set404);
    }
}

init(config);


function readFile(file) {
    try{
        return require("./marketshare" + file + ".json");
    }catch(e){
        console.info(file + " not found");
        return false;
    }
}

function loadResponses(place, req, res, next){
    //console.info("loading response for %s", place);
   // if(cache[place]){
   //     return cache[place];
   // } else {
        var file = readFile(config.baseUrl + req.url);
        if(file){
            //cache[place] = file;
            return file;
    //     } else {
    //         //next();
         }
    // }
}

function set404(req, res, next){
    res.status(404).send();
    //next();
}

function loadFunctions(place, req, res, next){
    //console.info("loading " + place.name);
    console.info("here");
    return config.funcs[place['function']](req, res);
}

function sendResponse(res, body) {
    console.info("sending");
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,DELETE,POST');
    res.set("Access-Control-Allow-Headers", "X-Requested-With");
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Content-Type', 'application/json');
    res.json(body).end();
}



app.listen(3001);
console.log('listing on port 3001');