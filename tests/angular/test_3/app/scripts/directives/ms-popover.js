'use strict';

angular.module('ui.bootstrap.mspopover', ['template/popover/mspopover.html', 'ui.bootstrap'])
    .directive('mspopover', ['$tooltip',
        function($tooltip) {
            return $tooltip('mspopover', 'popover', 'click');
        }
    ])
    .directive('mspopoverPopup', function($compile) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            link: function(scope, elements, attrs) {
                var e = $compile(attrs.content);
                scope.content = e(scope);
                scope.setTitle = function(newTitle) {
                    scope.title = newTitle;
                };
            },
            scope: {
                title: '@',
                // content: '@',
                placement: '@',
                animation: '&',
                isOpen: '&'
            },
            templateUrl: 'template/popover/mspopover.html'
        };
    });

angular.module('template/popover/mspopover.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('template/popover/mspopover.html',
            "<div class=\"popover {{placement}} ms-popover\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
            "  <div class=\"arrow\"></div>\n" +
            "\n" +
            "  <div class=\"popover-inner\">\n" +
            "      <h3 class=\"popover-title\" bind-html-unsafe=\"title\" ng-show=\"title\"></h3><a class=\"close\" ng-click=\"cancel($event)\" ng-show=\"completed\">x</a>\n" +
            "      <div class=\"popover-content\" bind-html-unsafe=\"content\" ><div ng-transclude></div></div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
    }
]);