/* jshint unused:false */

'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ViewService', ["$rootScope", "EVENTS", function($rootScope, EVENTS) {
        var model, currentView, self = this;
        this.init = function() {
                $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                self.setCurrentView(toState.name);
            });
        };

        this.setModel = function(which) {
            model = which;
            $rootScope.$broadcast(EVENTS.changeViewModel, model);
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

        this.init();
        
    }]);