'use strict';

angular.module('ThreeSixtyOneView')
    .service('ViewService', function($rootScope, $route) {
        var model, currentView = $route.current.$$route.viewName,
            self = this;


        this.setModel = function(which) {
            model = which;
            $rootScope.$broadcast('ViewService:modelChange', which);
        }

        this.getModel = function() {
            return model;
        }

        this.setCurrentView = function(view) {
            currentView = view;
        }

        this.getCurrentView = function() {
            return currentView;
        }

        $rootScope.$on("$routeChangeSuccess", function() {
            self.setCurrentView($route.current.$$route.viewName)
        })
    });