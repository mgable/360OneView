'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ErrorService', ["$rootScope", "dialogs", "EVENTS", "CONFIG", function ErrorService($rootScope, dialogs, EVENTS, CONFIG) {

  	//TODO: move this to a separate config file
	var errors = {
		"isNotUnique": "The name you have chosen already exists. Please chose another.",
		"minlength": "The name you have choosen is too short. Please choose a name which is at least " + CONFIG.application.inputRestrictions.minimumCharacterLimit + " characters in length.",
		"maxlength": "The name you have choosen is too long. Please choose a name which is shorter than " + CONFIG.application.inputRestrictions.maximumCharacterLimit + " characters.",
		"parse": "This field requires a value.",
		"pattern": "The name can not contain the following characters: " + CONFIG.application.inputRestrictions.characterRestrictions

	}

	function error(title, msg){
		dialogs.error(title, msg);
	}

	this.getError = function(errorObj){	
		var type = Object.keys(errorObj)[0];
		if (!type || !errors[type]) return;
		return errors[type];
	}

	$rootScope.$on(EVENTS.serverError, function(event, data){
		error("ERROR: server error " + data.status.toString(), "The request to " + data.config.url + " responsed with an error " + data.status.toString());
	});

	$rootScope.$on(EVENTS.error, function(event, data){
		error(data.title, data.msg);
	});


	$rootScope.$on(EVENTS.noDataReceived, function(event, data){error("ERROR: Data issues", data.msg);});

  }]);
