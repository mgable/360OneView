'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ErrorService', ["$rootScope", "dialogs", "EVENTS", function ErrorService($rootScope, dialogs, EVENTS) {
	
	$rootScope.$on(EVENTS.noDataReceived, function(event, data){error(data.msg);});

	function error(msg){
		dialogs.error("No Data received", msg);
	}

  }]);
