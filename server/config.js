var config = {};

config.places = [{
    "url": "/marketshare/home",
    "file": "./marketshare/data.json"
}, {
    "url": "/marketshare/dashboard",
    "file": "./marketshare/data.json"
}, {
    "url": "/marketshare/decisionbook",
    "file": "./marketshare/data.json"
}, {
    "url": "/marketshare/login/fred/wilma",
    "file": "./marketshare/success.json"
}, {
    "url": "/marketshare/login/*/*",
    "file": "./marketshare/fail.json"
}, {
    "url": "/marketshare/test",
    "file": "./marketshare/test.json"
}];

config.baseUrl = ''

module.exports = config;