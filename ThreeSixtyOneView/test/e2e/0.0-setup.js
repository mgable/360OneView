"use strict";

var servers = require('./servers.js'),
	_ = require('underscore'),
	fs = require('fs'),
	filename = "./test/e2e/project.json",
  //projects = _require('./getData.js'),
	clientServer = servers.getServer(browser.params.client.toLowerCase());

console.info("Running tests against: " + browser.params.client);

// console.info("project data is");
// console.info(projects.data);

jasmine.Env.prototype.bailFast = function() {
  var env = this;
  env.beforeEach(function() {
  	console.error("Unkown client '" + browser.params.client + "': BAILING!");
      env.specFilter = function(spec) {
        return false;
      };
  });
};

if (clientServer === null){
	jasmine.getEnv().bailFast();
}