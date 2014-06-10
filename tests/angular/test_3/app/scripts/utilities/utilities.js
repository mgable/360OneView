'use strict';

function msFilterObjByFn(obj, fn) {
    var results = {};
    for (var prop in obj) {
        if (fn(prop)) {
            results[prop] = obj[prop];
        }
    }
    return results;
}