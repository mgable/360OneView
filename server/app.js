var express = require('express'),
    app = express(),
    fs = require('fs'),
    config = require('./config'),
    data = require('./marketshare/makeData.js');

console.info(data.makeData());

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
        sendResponse(res, data.makeData());
    });
}

init();

function readFile(file) {
    //return fs.readFileSync(file, 'utf-8');
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

// var allowCrossDomain = function(req, res, next) {


//     next();
// }

app.listen(3001);
console.log('listing on port 3001');

// app.use(allowCrossDomain);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(function(req, res, next) {
    console.log('missing: ' + '%s %s', req.method, req.url);
    next();
});