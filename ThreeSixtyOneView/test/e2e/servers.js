"use strict";
var clients = {
		"ford": 'http://ec2-54-205-7-240.compute-1.amazonaws.com:8080',
		"hilton": 'http://ec2-54-91-240-179.compute-1.amazonaws.com:8081'
	},

	data = {
	getServer: function(client){
		if(client && clients[client]){
			return clients[client];
		} else {
			return null;
		}
	}
};

module.exports = data;