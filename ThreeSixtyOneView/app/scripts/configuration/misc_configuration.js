"use strict";

angular.module('ThreeSixtyOneView').config(function($logProvider) {
    String.prototype.bool = function() {
        return (/^true$/i).test(this);
    };
    // turn off logging primarily for angular-virtual-scroll
    $logProvider.debugEnabled(false);
}).run([function() {
}]);