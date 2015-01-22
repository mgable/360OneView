'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("closeExpandControl", [function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                scope.isClosed = true;
                var targetArea = attrs['targetArea'],
                    tabId = attrs['tabId'];
                scope.$parent.tabControl = scope.$parent.tabControl || {};
                scope.$parent.tabControl[tabId] = {
                    collapsed: true,
                    target: targetArea,
                    element: element
                };

                element.on('click', function() {
                    scope.$parent.tabControl[tabId].collapsed = !scope.$parent.tabControl[tabId].collapsed;
                    $(element).toggleClass('lightestgrayBg');
                    $(targetArea).toggleClass('hidden');

                    _.each(scope.$parent.tabControl, function(tab, index) {
                        if(index !== tabId && !tab.collapsed) {
                            $(tab.element).removeClass('lightestgrayBg');
                            $(tab.target).addClass('hidden');
                            tab.collapsed = true;
                        }
                    });
                });
            }
        };
    }])
    .directive("closeControl", [function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.on('click', function(){
                    _.each(scope.$parent.tabControl, function(tab, index) {
                        if(!tab.collapsed) {
                            $(tab.element).removeClass('lightestgrayBg');
                            $(tab.target).addClass('hidden');
                            tab.collapsed = true;
                        }
                    });
                });
            }
        };
    }]);