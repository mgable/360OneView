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

app.get('*', cors(),  function(req, res, next){
    sendResponse(res, readFile(req.url));
})



// function createResponse(req, res) {
//     app[place.method](place.url, cors(), function(req, res) {
//         sendResponse(res, loadResponses(place, req, res));
//     });
// }



// function loadScenarios(scenariosUrl){
//     return readFile(config.baseUrl + scenariosUrl);
// }


function readFile(file) {
    try{
        return require("./marketshare" + file + ".json");
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