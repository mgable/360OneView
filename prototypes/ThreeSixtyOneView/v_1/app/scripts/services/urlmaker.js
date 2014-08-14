'use strict';

angular.module('ThreeSixtyOneView')
  .service('Urlmaker', function($location) {
  	this.makeUrl = function(config){
  		switch(config.type){
  			case "dashboard" : makeDashboardUrl(config.name);break;
  			case "projects" : makeProjectUrl(); break;
  		}
  	}

  	var makeDashboardUrl = function(name){
  		var url = "/dashboard/" + name;
  		console.info("i am making an url " + url)
  		$location.path(url)
  	}

  	var makeProjectUrl = function(){
  		$location.path("/projects")
  	}
  });
