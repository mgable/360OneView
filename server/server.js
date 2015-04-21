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
    createProject: function (req){
        var response = _.clone(req.body);
        console.info("creating project");
        response.uuid = crypto.createHash('md5').update(response.name).digest('hex');

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
        }

        places["Project listing"].push(response);
        return response;
    },
    renameProject: function(req){
        var project = this.getProject(req.body.uuid);
        project.name = req.body.name;
        if (req.body.description){
            project.description = req.body.description;
        }
        return project;
    },
    getProject: function(uuid){
        return _.find(places["Project listing"], function(project){
            return project.uuid == uuid;
        });
    }
}

function init(config) {
    for (var i = 0, limit = config.places.length; i < limit; i++) {
        createResponse(i);
    }

    function createResponse(i) {
        app[config.places[i].method](config.places[i].url, cors(), function(req, res) {
            sendResponse(res, loadResponses(config.places[i], req));
        });
    }

    function loadResponses(place, req){
        if(place.file){
            if (places[place.name]){
                return places[place.name]
            }
            places[place.name] = readFile(config.baseUrl + place.file);
            return places[place.name];
        } else {
            return config.funcs[place['function']](req);
        }
    }
}

init(config);

function readFile(file) {
    return require(file);
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