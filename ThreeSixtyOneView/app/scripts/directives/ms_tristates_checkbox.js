'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msTristatesCheckbox
 * @description
 * # ms-treeview-checkbox
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msTristatesCheckbox', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList,
                    property = attrs.property;

                // Bind the onChange event to update children
                element.bind('change', function() {
                    scope.$apply(function() {
                        var isChecked = element.prop('checked');

                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function(child) {
                            if (child.isLocked !== true) {
                                child[property] = isChecked;
                            }
                        });
                    });
                });

                // Watch the children for changes
                scope.$watch(childList, function(newValue) {
                    var hasChecked = false,
                        hasUnchecked = false;

                    // Loop through the children
                    angular.forEach(newValue, function(child) {
                        child[property] ? hasChecked = true : hasUnchecked = true;
                    });

                    // Determine which state to put the checkbox in
                    if (hasChecked && hasUnchecked) {
                        element.prop('checked', false);
                        element.prop('indeterminate', true);
                        if (modelCtrl) {
                            modelCtrl.$setViewValue(true);
                        }
                    } else {
                        element.prop('checked', hasChecked);
                        element.prop('indeterminate', false);
                        if (modelCtrl) {
                            modelCtrl.$setViewValue(hasChecked);
                        }
                    }
                }, true);
            }
        };
    });
