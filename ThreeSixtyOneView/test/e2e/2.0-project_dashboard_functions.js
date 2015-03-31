"use strict";

var coreFunctions = require('./1.0-project_listing_functions.js'),
	specs = require('./2.0-project_dashboard_specs.js'),
	_ = require('underscore'),

	data = {
		getAllScenarioNames: function(){
			return element.all(by.binding("item.name"));
		}
	}

_.extend(data, coreFunctions);

module.exports = data;