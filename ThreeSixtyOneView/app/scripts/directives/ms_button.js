/**
* @name ms-button
* @desc Directive of standard button - defaults to 'Submit button' <ms-button></ms-button>
* @requires {directive} icon.js
* @param label - label="{label string}" - defalut is "Submit"
* @param icon - icon="{fa-icon name}" - deafault ng-show(false)
* @param type - type="{type string}" - default is type of 'submit'
* @param action - REQUIRED - action="{action event}" - no default
* @event action - ng-click event
*/

/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msButton', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: "@",
                icon: "@",
                type: "@",
                action: "&"
            },
            template: '<button class="btn btn-default ms-btn-{{type}}" ng-click="action()"><icon ng-if="hasIcon" type="{{icon}}"></icon>{{label}}</button>',
            link: function($scope) {
                console.log("buttons");
                $scope.label = $scope.label || "Submit";

                $scope.hasIcon = $scope.icon || false;

                $scope.type = $scope.type || "submit";
            }
        };
    }]);