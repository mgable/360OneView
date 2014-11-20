'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ErrorService', ["$rootScope", "dialogs", "EVENTS", function ErrorService($rootScope, dialogs, EVENTS) {

	$rootScope.$on(EVENTS.noDataReceived, function(event, data){error("ERROR: Data issues", data.msg);});

	function error(title, msg){
		dialogs.error(title, msg);
	}

	$rootScope.$on(EVENTS.serverError, function(event, data){
		error("ERROR: server error " + data.status.toString(), "The request to " + data.config.url + " responsed with an error " + data.status.toString());
	});

	$rootScope.$on(EVENTS.error, function(event, data){
		error(data.title, data.msg);
	});

  }]);
