var express = require('express'),
    bodyParser = require("body-parser"),
    app = express(),
    fs = require('fs'),
    cors = require('cors'),
    _ = require('underscore'),
    config = require('./config'),
    crypto = require('crypto'),
    cache = {},
    data = JSON.parse(fs.readFileSync("./marketshare/data.json", 'utf8'));

    console.info(data);

app.options("*", cors());
app.use(bodyParser.json()); 


app.get('*', cors(),  function(req, res, next){
    var responseData = loadResponses(req.url);
    if (responseData){
        sendResponse(res, responseData);
    } else {
        console.info("there!!!");
        next();
    }
}, set404);




config.funcs = {
    startingScenarioId: 300,
    scenarioCache: {},
    createProject: function (req, res){
        var response = _.clone(req.body);
        console.info("creating project");
        response.uuid = crypto.createHash('md5').update(response.name).digest('hex');
        response = this.addAuditInfo(response);

        data.rubix.v1["project.json"].push(response);
        data.rubix.v1.project[response.uuid] = {'scenario.json': []};
        data.rubix.v1.favorite.project[response.uuid] = {'scenario.json': []};
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
    makeAnalysisView: function(req){
        return req.body;
    },
    renameScenario: function(req){
        console.info(req);
        var scenario = this.getScenario(req.params[0], req.body.id);
        scenario.name = req.body.name;
        scenario = this.addAuditInfo(scenario);
        return scenario;
    },
    editScenario: function(req){
        var scenario = this.getScenario(req.params[0], req.body.id);
        scenario.description = req.body.description;
        scenario = this.addAuditInfo(scenario);
        return scenario;
    },
    createScenario: function(req){
        console.info("creating scenario");
        var response = _.clone(req.body);
        response.id = this.startingScenarioId++;
        response = this.addAuditInfo(response);
        data.rubix.v1.project[req.params[0]]["scenario.json"].push(response);
        this.createAnalysisElement(response.id);
        return response;
    },
    createAnalysisElement: function(id){
        var copyAnalysisElement = data.rubix.v1.scenario['100']['analysis-element.json'];
        data.rubix.v1.scenario[id] = {'analysis-element.json': copyAnalysisElement};
    },
    getProject: function(uuid){
        return _.find(data.rubix.v1['project.json'], function(project){
            return project.uuid == uuid;
        });
    },
    // getProjectUuidFromUrl: function(url){
    //     return url.match(/\w{32}/)[0];
    // },
    getScenario: function(projectUuid, scenarioId){
        return _.find(data.rubix.v1.project[projectUuid]["scenario.json"], function(scenario){
            return scenario.id === scenarioId;
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
        data.rubix.v1.favorite['project.json'].push({uuid: req.body.uuid});
    },
    unfavoriteProject: function(req){
        data.rubix.v1.favorite['project.json'] = _.reject(data.rubix.v1.favorite['project.json'], function(favorite){
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


function loadResponses(url){
  var path = url.replace(/\?.*/, ""),
    path = path + ".json",
    objId = _.compact(path.split("/")), objString = "";

  objId.forEach(function(part){
    objString += "[\'" + part+ "\']"
  })
  try {
    return eval("data" + objString);
    }catch(e){
        console.error("data" + objString + " does not exist");
    }
}

function set404(req, res, next){
    res.status(404).send();
    //next();
}

function loadFunctions(place, req, res, next){
    return config.funcs[place['function']](req, res);
}

function sendResponse(res, body) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,DELETE,POST');
    res.set("Access-Control-Allow-Headers", "X-Requested-With");
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Content-Type', 'application/json');
    res.json(body).end();
}



app.listen(3001);
console.log('listing on port 3001');