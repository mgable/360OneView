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

    function fileTypeCounts() {
        return currentData.data.reduce(function(pv, cv, i, arr) {
            (cv.fileType in pv) ? pv[cv.fileType]++ : pv[cv.fileType] = 1;
            // if (!_.isEmpty(cv.search)) {
            //     (cv.search in pv) ? pv[cv.search]++ : pv[cv.search] = 1;
            // }

            return pv;
        }, {
            All: currentData.data.length
        })
    }


    app.options("*", cors());

    // get all or query
    app.get("/api/items", function(req, res) {
        console.info(req.query)
        var results = currentData.data;
        if (req.query && (req.query.start && req.query.end)) {
            results = currentData.data.slice(req.query.start, req.query.end)
        }

        sendResponse(res, {
            status: "success",
            totalItemsReturned: results.length,
            data: results
        });

    });

    // get single record
    app.get("/api/items/:id", function(req, res) {
        var results = getRecordById(req.params.id, currentData.data),
            status = (results) ? "success" : "fail";

        sendResponse(res, {
            status: status,
            data: results
        });
    });

    // clone record
    app.post("/api/items/:id", function(req, res) {
        console.info("Cloning " + req.params.id);
        var tempRecord = _.clone(getRecordById(req.params.id, currentData.data));
        tempRecord.id = generateUUID();
        tempRecord.title += " CLONED";
        tempRecord.createdDate = new Date();
        tempRecord.modifiedBy = "nobody";
        tempRecord.lastModified = "";
        tempRecord.createdBy = "you";
        currentData.data.push(tempRecord)
        sendResponse(res, tempRecord);
    });

    // create record
    app.post("/api/items", function(req, res) {
        console.info("creating new record ");
        console.info(req.body);

        var tempRecord = {};
        tempRecord.id = generateUUID();
        tempRecord.title = req.body.title;
        tempRecord.description = req.body.description;
        tempRecord.createdDate = new Date();
        tempRecord.modifiedBy = "nobody";
        tempRecord.lastModified = "";
        tempRecord.createdBy = "you";
        tempRecord.masterSet = false;
        currentData.data.push(tempRecord)
        sendResponse(res, {
            totalItemsReturned: currentData.data.length,
            status: "success",
            data: currentData.data
        });
    });


    // update single record
    app.put("/api/items/:id", cors(), function(req, res) {

        var index = getIndexById(req.params.id, currentData.data),
            status = (index !== false) ? "success" : "fail";

        currentData.data[index] = req.body;

        sendResponse(res, {
            status: status,
            data: index
        });
    });

    //delete record(s)
    app.delete("/api/items", function(req, res) {
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
            totalItemsReturned: currentData.data.length,
            status: "success",
            data: currentData.data
        });
    });

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

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
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,DELETE,POST');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', body.length);
    res.end(res.jsonp(body));
}



app.listen(3001);
console.log('listing on port 3001');