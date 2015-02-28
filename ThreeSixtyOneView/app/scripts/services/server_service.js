"use strict";

angular.module('ThreeSixtyOneView.services').service("ServerService",['SERVER', '$location', function(SERVER, $location) {
    this.get = function(instance){
      if ($location.search().server){
        console.info("using new server");
        return $location.search().server;
      }

      return SERVER[instance];
    }
}]);