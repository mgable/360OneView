'use strict';

angular.module('ThreeSixtyOneView')
  .service('Urlmaker', ["$location", function($location) {
  	this.makeUrl = function(config){
  		switch(config.type){
  			case "dashboard" : makeDashboardUrl(config.name);break;
  			case "projects" : makeProjectUrl(); break;
        case "scenarioEdit": makeScenarioEditURL(config.project, config.item);break;
  		}
  	}

  	var makeDashboardUrl = function(name){
  		var url = "/dashboard/" + name;
  		$location.path(url)
  	}

  	var makeProjectUrl = function(){
  		$location.path("/projects")
  	}

    var makeScenarioEditURL = function(project, item){
      var url = "/scenarioEdit/"+ project + "/" + item.title;
      $location.path(url);
    }
  }]);
