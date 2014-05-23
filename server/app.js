var express = require('express'),
    app = express(),
    fs = require('fs'),
    config = require('./config'),
    data = require('./marketshare/makeData.js'),
    currentData = data.makeData();

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

function init() {
    for (var i = 0, limit = config.places.length; i < limit; i++) {
        createResponse(i);
    }

    function createResponse(i) {
        app.get(config.places[i].url, function(req, res) {
            sendResponse(res, readFile(config.baseUrl + config.places[i].file));
        });
    }

    app.get("/marketshare/filemanager", function(req, res) {
        sendResponse(res, currentData);
    });

    app.post("/marketshare/filemanager", function(req, res) {
        console.log(req.body);
        currentData = {
            "data": [req.body]
        }
        sendResponse(res, {
            "foo": "bar"
        });
    });
}

init();

function readFile(file) {
    return require(file);
}

function sendResponse(res, body) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', body.length);
    res.end(res.jsonp(body));
}



app.listen(3001);
console.log('listing on port 3001');