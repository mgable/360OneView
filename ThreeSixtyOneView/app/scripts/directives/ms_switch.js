'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msSwitch', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            link: function(scope, element, attrs, ngModel) {

                // Specify how UI should be updated
                ngModel.$render = function() {
                    render();
                };

                var render = function() {
                    var val = ngModel.$viewValue;

                    var open = angular.element(element.children()[0]);
                    open.removeClass(val ? 'hide' : 'show');
                    open.addClass(val ? 'show' : 'hide');

                    var closed = angular.element(element.children()[1]);
                    closed.removeClass(val ? 'show' : 'hide');
                    closed.addClass(val ? 'hide' : 'show');
                };

                // Listen for the button click event to enable binding
                element.bind('click', function() {
                    scope.$apply(toggle);
                });

                // Toggle the model value
                function toggle() {
                    var val = ngModel.$viewValue;
                    ngModel.$setViewValue(!val);
                    console.log(!val ? 'ON' : 'OFF');
                    render();
                }

                if (!ngModel) {
                    //TODO: Indicate that something is missing!
                    return;
                } // do nothing if no ng-model

                // Initial render
                render();
            },
            template: '<span class="btn ms-switch"><span class="ms-switch-on btn-primary">ON</span><span class="ms-switch-off btn-default">OFF</span></span>',
        };
    });
