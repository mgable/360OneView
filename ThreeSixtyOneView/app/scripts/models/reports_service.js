'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ReportsService', ["Model", "ReportsModel", function ImportService(Model, ReportsModel) {
        var MyReportsModel, myReports;

        MyReportsModel = new Model();
        angular.extend(this, MyReportsModel.prototype);
        myReports = new MyReportsModel(ReportsModel);
        angular.extend(this, myReports);

        this.getSummary = function(elementId, viewId){
            return this.resource.get({elementId: elementId, viewId: viewId}, this.reportConfig, '').then(function(response){
                return response;
            });
        };
}]);
