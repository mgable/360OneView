"use strict";

angular.module('ThreeSixtyOneView.services').service("ServerService",['SERVER', '$location', function(SERVER, $location) {
	var cache = {}, server;

	this.get = function(instance){
		server = $location.search().server;

		if (server === "reset"){
			this.clearCache();
		} else if (instance && cache[instance]){
			return cache[instance];
		} else if (server){
			console.info("caching new server");
			cache[instance] = server;
			return server;
		}

		return SERVER[instance];
	};

	this.clearCache = function(){
		cache = {};
	};
}]);