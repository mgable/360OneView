"use strict";

angular.module('ThreeSixtyOneView').config(function() {
    String.prototype.bool = function() {
        return (/^true$/i).test(this);
    };
})
// .run(function($location, SERVER){
//     console.info($location.host());
//     console.info(SERVER[$location.host()]);
// })
.run(["FavoritesService", "ProjectsService", function(FavoritesService, ProjectsService) {
	// For now, pre-fetch all data
	ProjectsService.find();
    FavoritesService.find();
}]);