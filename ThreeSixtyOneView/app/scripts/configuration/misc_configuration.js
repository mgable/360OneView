"use strict";

angular.module('ThreeSixtyOneView').config(function() {
    String.prototype.bool = function() {
        return (/^true$/i).test(this);
    };
}).run([function() {
	// For now, pre-fetch all data
	// ProjectsService.find();
    // FavoritesService.find("project");
}]);