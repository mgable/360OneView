var express = require('express'),
    _ = require('underscore'),
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

    // get single record
    app.get("/api/item/:id", function(req, res) {
        var results = getRecordById(req.params.id, currentData.data),
            status = (results) ? "success" : "fail";

        sendResponse(res, {
            status: status,
            data: results
        });
    });

    // clone record
    app.post("/api/item/:id", function(req, res) {
        var temp = {
            "id": "xbde795-67dd-426c-87bb-4e8df26a0255",
            "title": "new cloned thingy",
            "description": "new description",
            "createdBy": "Some Dude",
            "createdDate": new Date(),
            "fileType": "Playbook",
            "search": "",
            "modifiedBy": "nobody",
            "lastModified": ""
        };
        currentData.data.push(temp)
        sendResponse(res, temp);
    });

    // update single record
    app.put("/api/item/:id", cors(), function(req, res) {

        var index = getIndexById(req.params.id, currentData.data),
            status = (index !== false) ? "success" : "fail";

        currentData.data[index] = req.body;

        sendResponse(res, {
            status: status,
            data: index
        });

        //console.info(currentData.data);
    });

    //delete record(s)
    app.delete("/api/item", function(req, res) {
        console.info("delete");
        console.info(req.query.ids);
        var indexes = [],
            itemsToDelete = _.isArray(req.query.ids) ? req.query.ids : [req.query.ids];

        for (var x = 0, limit = itemsToDelete.length; x < limit; x++) {
            _.each(currentData.data, function(e, i, l) {
                if (e.id === itemsToDelete[x]) {
                    indexes.push(i);
                    return;
                }
            })
        }

        indexes.sort().reverse();

        for (var x = 0, limit = indexes.length; x < limit; x++) {
            currentData.data.splice(indexes[x], 1);
        }

        sendResponse(res, {
            status: "status",
            data: "results"
        });
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