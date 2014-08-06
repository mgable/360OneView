angular.module("myapp", []).directive("test", function() {
    return {
        restrict: "AE",
        // template: "<h1>Hello world</h1>"
        templateUrl: "template.html"
    }
});