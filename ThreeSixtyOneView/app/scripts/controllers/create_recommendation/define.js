'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
  .controller('CreateRecommendationDefineCtrl', function ($scope) {
    $scope.kpis = [
      {label: "Net Bookings"},
      {label: "Revenue"},
      {label: "Room Nights"}
    ];
  });
