'use strict';

angular.module('ThreeSixtyOneView.directives').directive("tabsControl", ["$rootScope", "EVENTS", function($rootScope, EVENTS){
        return {
            restrict: "A",
            controller: function(){
                this.tabs = [];

                this.register = function(item){
                    this.tabs.push(item);
                };

                this.closeAll = function(){
                    _.each(this.tabs, function(tab) {
                        $(tab.target).addClass('hidden');
                        $(tab.element).removeClass('active');
                    });
                    $rootScope.$broadcast(EVENTS.tabClosed);
                };
            }
        };
    }])
    .directive("expandCollapseControl", [function() {
        return {
            restrict: "A",
            require: "^tabsControl",
            link: function(scope, element, attrs, ctrl) {
                var target = attrs.expandCollapseControl, disabled = false;
                ctrl.register({element: element, target: target});

                element.on('click', function() {
                    var active = true;

                    if (!disabled){
                        if (!$(target).hasClass('hidden')){
                            active = false;
                        }
                        ctrl.closeAll();
                        if(active){
                            $(target).removeClass('hidden');
                            $(element).addClass('active');
                        }
                    }
                });

                // if(ctrl.tabs.length === 1) {
                //     setTimeout(function() { ctrl.closeAll(); }, 100);
                // }

                attrs.$observe("expandCollapseControlDisabled", function(){
                    disabled = attrs.expandCollapseControlDisabled === "false" || typeof attrs.expandCollapseControlDisabled  === "undefined" ? false : true;
                });
            }
        };
    }])
    .directive("collapseControl", [function() {
        return {
            restrict: "A",
            require: "^?tabsControl",
            link: function(scope, element, attrs, ctrl) {
                element.on('click', function(){
                    ctrl.closeAll();
                });
            }
        };
    }]);