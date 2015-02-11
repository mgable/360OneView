'use strict';

angular.module('ThreeSixtyOneView.directives').directive("tabsControl", [function(){
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

                attrs.$observe("expandCollapseControlDisabled", function(){
                    disabled = attrs.expandCollapseControlDisabled === "false" || typeof attrs.expandCollapseControlDisabled  === "undefined" ? false : true;
                });
            }
        };
    }])
    .directive("collapseControl", [function() {
        return {
            restrict: "A",
            require: "^tabsControl",
            link: function(scope, element, attrs, ctrl) {
                element.on('click', function(){
                    ctrl.closeAll();
                });
            }
        };
    }]);