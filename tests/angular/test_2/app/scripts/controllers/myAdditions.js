angular.module('ui.bootstrap.mypopover', ["template/popover/mypopover.html", "ui.bootstrap"])
    .directive('mypopover', ['$tooltip',
        function($tooltip) {
            return $tooltip('mypopover', 'popover', 'click');
        }
    ])
    .directive('mypopoverPopup', function($compile) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            link: function(scope, elements, attrs) {
                var e = $compile(attrs.content);
                scope.content = e(scope);
                scope.setTitle = function(newTitle) {
                    scope.title = newTitle;
                }
            },
            scope: {
                title: '@',
                // content: '@',
                placement: '@',
                animation: '&',
                isOpen: '&'
            },
            templateUrl: 'template/popover/mypopover.html'
        };
    });

angular.module("template/popover/mypopover.html", []).run(["$templateCache",
    function($templateCache) {
        $templateCache.put("template/popover/mypopover.html",
            "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
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