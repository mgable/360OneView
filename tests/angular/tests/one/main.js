var app = angular.module("myApp", []);

app.controller('MainCtrl', function($scope, bdRoster, bdUnit) {
    $scope.data = bdRoster.$find("1");
    $scope.data.$getUnits();
}).controller('UnitCtrl', function($scope, bdUnit) {
    $scope.units = bdUnit.$find();
})