'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ViewService', ["$rootScope", function($rootScope) {
        var model, currentView, self = this;

        this.setModel = function(which) {
            model = which;
            $rootScope.$broadcast('ViewService:modelChange', which);
        };

        this.getModel = function() {
            return model;
        };

        this.setCurrentView = function(which) {
            currentView = which;
        };

        this.getCurrentView = function() {
            return currentView;
        };

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
            self.setCurrentView(toState.name);
        });
    }]);