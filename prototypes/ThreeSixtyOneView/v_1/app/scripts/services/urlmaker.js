'use strict';

angular.module('ThreeSixtyOneView')
  .service('Urlmaker', function($location) {
  	this.makeUrl = function(config){
  		switch(config.type){
  			case "dashboard" : makeProjectUrl(config.name);break;
  		}
  	}

  	var makeProjectUrl = function(name){
  		var url = "/dashboard/" + name;
  		console.info("i am making an url " + url)
  		$location.path(url)
  	}
  });
