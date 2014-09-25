/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("contextualMenu", ["$rootScope", "CONFIG", "ActiveSelection", "DiaglogService", "FavoritesService", "ViewService", "InfoTrayService", function($rootScope,  CONFIG, ActiveSelection, DiaglogService, FavoritesService, ViewService, InfoTrayService) {
        return {
            restrict: "AE",
            templateUrl: "views/directives/contextual_menu.tpl.html",
            scope: {
                item: "=",
                cname: "@"
            },
            replace: true,
            link: function(scope, element, attrs) {
                var actions = CONFIG.view[ViewService.getCurrentView()].contextualMenu.actions,
                    menuViews = CONFIG.view[ViewService.getCurrentView()].contextualMenu.views;
                scope.DiaglogService = DiaglogService;
                scope.FavoritesService = FavoritesService;
                scope.InfoTrayService = InfoTrayService;
                scope.ActiveSelection = ActiveSelection;
                scope.service = ViewService.getModel();
                scope.actions = actions;

                $rootScope.$on('ViewService:modelChange', function(event, data) {
                    scope.service = data;
                });

                scope.alert = function(msg) {
                    window.alert(msg);
                };

                function setView(which) {
                    if (which) {
                        var set = false;
                        for (var prop in menuViews) {
                            if (which[prop] && which[prop] === menuViews[prop].type) {
                                setValues(actions, menuViews[prop].value);
                                set = true;
                                break;
                            }
                        }
                        if (!set) {
                            setValues(actions, menuViews.otherwise);
                        }
                    }
                }

                function setValues(actions, values) {
                    _.each(actions, function(e, i, a) {
                        scope[e.name] = {};
                        scope[e.name].show = !!parseInt(values[i]);
                        scope[e.name].label = e.label || e.name;
                        scope[e.name].config = e.config;
                    });
                }

                setView(scope.item);
            }
        };
    }]);