"use strict";

var coreFunctions = require('./1.0-project_listing_functions.js'),
	specs = require('./2.0-project_dashboard_specs.js'),
	_ = require('underscore'),
	flow = protractor.promise.controlFlow(),

	data = {
		getRAW_Scenarios: function(uuid, cb){
			var scenarios;
			flow.await(coreFunctions.getRawData_scenarios(uuid).then(function(data){
				scenarios = data;
			})).then(function(){
				cb(scenarios);
			});
		}
	}

_.extend(data, coreFunctions);

module.exports = data;