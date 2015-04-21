var express = require('express'),
    app = express(),
    fs = require('fs'),
    cors = require('cors'),
    _ = require('underscore'),
    config = require('./config');

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

function init() {
    for (var i = 0, limit = config.places.length; i < limit; i++) {
        createResponse(i);
    }

    function createResponse(i) {
        app.get(config.places[i].url, cors(), function(req, res) {
            sendResponse(res, readFile(config.baseUrl + config.places[i].file));
        });
    }

    // // get all or query
    // app.get("/marketshare/filemanager", function(req, res) {
    //     sendResponse(res, currentData);
    // });

    // // get single
    // app.get("/marketshare/filemanager/:id", function(req, res) {
    //     var results = getRecordById(req.params.id, currentData.data),
    //         status = (results) ? "success" : "fail";

    //     sendResponse(res, {
    //         status: status,
    //         data: results
    //     });
    // });

    app.post("/rubix/v1/project", function(req, res) {
        req.body.uuid = "1234567";

        console.info(req.body);

        sendResponse(res, req.body);
    });

    // // update
    // app.put("/marketshare/filemanager/:id", function(req, res) {

    //     var results = getRecordById(req.params.id, currentData.data),
    //         status = (results) ? "success" : "fail";

    //     sendResponse(res, {
    //         status: status,
    //         data: results
    //     });
    // });

    // function getRecordById(id, arr) {
    //     var record = false;
    //     for (var x = 0, limit = arr.length; x < limit; x++) {
    //         if (arr[x]['id'] == id) {
    //             return arr[x];
    //         }
    //     }
    //     return record;
    // }

    // function getIndexById(id, arr) {
    //     var record = false;
    //     for (var x = 0, limit = arr.length; x < limit; x++) {
    //         if (arr[x]['id'] == id) {
    //             return x;
    //         }
    //     }
    //     return record;
    // }

    // //delete 
    // app.delete("/marketshare/filemanager/:id", function(req, res) {

    //     var results = getIndexById(req.params.id, currentData.data),
    //         status = (results !== false) ? "success" : "fail";

    //     if (results !== false) {
    //         currentData.data.splice(results, 1);
    //     }

    //     sendResponse(res, {
    //         status: status,
    //         data: results
    //     });
    // });
}

init();

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