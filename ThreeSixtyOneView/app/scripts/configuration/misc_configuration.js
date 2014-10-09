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
.run(["FavoritesService", "ProjectsModel", function(FavoritesService, ProjectsModel) {
	// For now, pre-fetch all data
	ProjectsModel.find();
    FavoritesService.model.find();
}]);