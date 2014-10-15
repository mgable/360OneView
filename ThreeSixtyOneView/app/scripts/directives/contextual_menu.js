/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("contextualMenu", ["$rootScope", "$state", "CONFIG", "ActiveSelection", "DiaglogService", "FavoritesService", "InfoTrayService", "SortAndFilterService", "EVENTS", function($rootScope, $state, CONFIG, ActiveSelection, DiaglogService, FavoritesService,  InfoTrayService, SortAndFilterService, EVENTS) {
        return {
            restrict: "AE",
            templateUrl: "views/directives/contextual_menu.tpl.html",
            scope: {
                item: "=",
                cname: "@"
            },
            replace: true,
            link: function(scope, element, attrs) {
                var actions = CONFIG.view[$state.current.name].contextualMenu.actions,
                    menuViews = CONFIG.view[$state.current.name].contextualMenu.views;
                scope.DiaglogService = DiaglogService;
                scope.InfoTrayService = InfoTrayService;
                scope.ActiveSelection = ActiveSelection;
                scope.actions = actions;

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


                scope.toggleFavorite = function(itemID){
                    FavoritesService.toggleFavorite(itemID);
                    SortAndFilterService.filter();
                };

                scope.isFavorite = function(itemID){
                    return FavoritesService.isFavorite(itemID);
                };

                setView(scope.item);
            }
        };
    }]);