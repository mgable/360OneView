'use strict';

angular.module('ThreeSixtyOneView.directives').directive("tabsControl", [function(){
        return {
            restrict: "A",
            controller: function($scope, $element, $attrs){
                this.tabs = [];

                this.register = function(item){
                    this.tabs.push(item);
                };

                element.on('click', function() {
                    if(scope.$parent.tabCollapseStatus() === 'disable') {
                        return;
                    } else if(scope.$parent.tabCollapseStatus() === 'intermediate') {
                        scope.$parent.tabCollapseStatus('enable');
                        return;
                    }

                    scope.$parent.tabControl[tabId].collapsed = !scope.$parent.tabControl[tabId].collapsed;
                    $(element).toggleClass('lightestgrayBg');
                    $(targetArea).toggleClass('hidden');

                this.closeAll = function(){
                    _.each(this.tabs, function(tab, index) {
                        $(tab.target).addClass('hidden');
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
                ctrl.register({element: element, target: target})

                element.on('click', function(evt) {
                    var active = true;
                    if (!disabled){
                        if (!$(target).hasClass('hidden')){
                            active = false;
                        }
                        ctrl.closeAll();
                        if(active){
                            $(target).removeClass('hidden');
                        }
                    };
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