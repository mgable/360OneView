var express = require('express'),
    app = express(),
    //fs = require('fs'),
    // config = require('./config'),
    cors = require('cors'),
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
    var collection = {
        data: makeCollection(currentData.data)
    };

    function makeCollection(data) {
        return data.reduce(function(previous, current, index, array) {
            previous.push(current.id);
            return previous;
        }, []);
    }

    app.options("*", cors());

    // get all or query
    app.get("/api/item", function(req, res) {
        sendResponse(res, currentData);
    });

    // get single
    app.get("/api/item/:id", function(req, res) {
        var results = getRecordById(req.params.id, currentData.data),
            status = (results) ? "success" : "fail";

        sendResponse(res, {
            status: status,
            data: results
        });
    });

    // app.post("/marketshare/filemanager", function(req, res) {

    //     currentData = {
    //         "data": [req.body]
    //     }
    //     sendResponse(res, {
    //         "foo": "bar"
    //     });
    // });

    // update
    app.put("/api/item/:id", cors(), function(req, res) {

        var index = getIndexById(req.params.id, currentData.data),
            status = (index !== false) ? "success" : "fail";

        currentData.data[index] = req.body;

        sendResponse(res, {
            status: status,
            data: index
        });

        console.info(currentData.data);
    });

    function getRecordById(id, arr) {
        var record = false;
        for (var x = 0, limit = arr.length; x < limit; x++) {
            if (arr[x]['id'] == id) {
                return arr[x];
            }
        }
        return record;
    }

    function getIndexById(id, arr) {
        var record = false;
        for (var x = 0, limit = arr.length; x < limit; x++) {
            if (arr[x]['id'] == id) {
                return x;
            }
        }
        return record;
    }

    //delete 
    app.delete("/marketshare/filemanager/:id", function(req, res) {

        var results = getIndexById(req.params.id, currentData.data),
            status = (results !== false) ? "success" : "fail";

        if (results !== false) {
            currentData.data.splice(results, 1);
        }

        sendResponse(res, {
            status: status,
            data: results
        });
    });
}

init();

function readFile(file) {
    return require(file);
}

function sendResponse(res, body) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', body.length);
    res.end(res.jsonp(body));
}



app.listen(3001);
console.log('listing on port 3001');