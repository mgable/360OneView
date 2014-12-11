angular.module('ThreeSixtyOneView.directives')
    .directive('msBarChart', ['$window', function($window) {
        return {
            restrict: 'EA',
            scope: {
                data: "=chartData"
            },
            link: function(scope, element, attrs) {

                    // setup variables
                    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
                        width = 290 - margin.left - margin.right,
                        height = 150 - margin.top - margin.bottom;

                    // create svg element
                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // on window resize, re-render d3 canvas
                    window.onresize = function() {
                        return scope.$apply();
                    };
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function(){
                        return scope.render(scope.data);
                    });

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    // define render function
                    scope.render = function(data) {

                        // remove all previous items before render
                        svg.selectAll("*").remove();

                        // set up series bars x scale
                        var x0 = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .3);

                        // set up individual bar x scale
                        var x1 = d3.scale.ordinal();

                        // set up y scale
                        var y = d3.scale.linear()
                            .range([height, 0]);

                        // set up color scale
                        var color = d3.scale.ordinal()
                            .domain(["1", "2", "3", "4"])
                            .range(["#125db6", "#068700", "#26c6da", "#26a69a"]);

                        // setup xAxis
                        var xAxis = d3.svg.axis()
                            .scale(x0)
                            .tickSize(0, 0)
                            .orient("bottom");

                        var typeNames = ["results", "compared"];
                        scope.data.forEach(function(d, i) {
                            d.types = typeNames.map(function(name) {
                                return {
                                    name: name,
                                    value: +d[name],
                                    id: d.id,
                                    categoryId: d.categoryId,
                                    colorId: d.colorId
                                };
                            });
                        });

                        x0.domain(scope.data.map(function(d) { return d.category; }));
                        x1.domain(typeNames).rangeRoundBands([0, x0.rangeBand()]);
                        y.domain([0, d3.max(scope.data, function(d) {
                            return d3.max(d.types, function(d) {
                                return d.value;
                            });
                        })]);

                        var patternData = [{
                            x1: 10,
                            y1: 0,
                            x2: 30,
                            y2: 20
                        }, {
                            x1: -10,
                            y1: 0,
                            x2: 10,
                            y2: 20
                        }, {
                            x1: 30,
                            y1: 0,
                            x2: 50,
                            y2: 20
                        }];
                        var defs = svg.append("defs");
                            defs.append("pattern")
                                .attr("id", "stripe")
                                .attr("patternUnits", "userSpaceOnUse")
                                .attr("width", 40)
                                .attr("height", 20)
                                .selectAll("line")
                                    .data(patternData).enter()
                                    .append("line")
                                    .attr('x1', function(d){ return d.x1; })
                                    .attr('x2', function(d){ return d.x2; })
                                    .attr('y1', function(d){ return d.y1; })
                                    .attr('y2', function(d){ return d.y2; });

                            defs.append("mask")
                                .attr("id", "mask")
                                .append("rect")
                                    .attr("height", 500)
                                    .attr("width", 500)
                                    .style("fill", "url(#stripe)");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        var bars = svg.selectAll(".bar")
                            .data(scope.data)
                            .enter().append("g")
                            .attr("class", "bars")
                            .attr("transform", function(d) {
                                return "translate(" + x0(d.category) + ",0)";
                            });

                        var bar = bars.selectAll(".bar")
                            .data(function(d) { return d.types; })
                            .enter().append("g")
                            .attr("class", "bar")
                            .style("opacity", 0.85)
                            .on("mouseover", function(d){
                                d3.select(this).transition().duration(300)
                                    .style("opacity", 1);
                                var sel = $('table.spend-table tbody:eq(' + d.categoryId + ') tr:eq(' + d.id  + ')');
                                sel.addClass('highlight');
                            })
                            .on("mouseout", function(d){
                                d3.select(this).transition().duration(300)
                                    .style("opacity", 0.85);
                                var sel = $('table.spend-table tbody:eq(' + d.categoryId + ') tr:eq(' + d.id  + ')');
                                sel.removeClass('highlight');
                            });

                        bar.append("rect")
                            .attr("x", function(d) { return x1(d.name); })
                            .attr("y", height)
                            .attr("height", 0)
                            .attr("width", x1.rangeBand())
                            .style("fill", function(d, i) {
                                return color(d.colorId);
                                // return d.name === "compared" ? d3.rgb(color(d.colorId)).darker(1) : color(d.colorId);
                            })
                            .style("opacity", 0)
                            .transition().ease("quad")
                                .delay(function(d, i) { return (d.colorId * 2 + i) * 100 })
                                .attr("height", function(d) { return height - y(d.value); })
                                .attr("y", function(d) { return y(d.value); })
                                .style("opacity", 1);

                        bar.append("rect")
                            .attr("x", function(d) { return x1(d.name); })
                            .attr("y", function(d) { return y(d.value); })
                            .attr("height", function(d) { return height - y(d.value); })
                            .attr("width", x1.rangeBand())
                            .style("fill", function(d, i) {
                                return i===1 ? "rgba(0, 0, 0, 0.3)" : "none";
                            })
                            .attr("mask", "url(#mask)")
                            .attr("stroke-linecap", "square")
                            .attr("stroke-linejoin", "miter")
                            .style("opacity", 0)
                            .transition().ease("quad")
                                .delay(function(d, i) { return (d.colorId * 2 + i) * 100 })
                                .attr("height", function(d) { return height - y(d.value); })
                                .attr("y", function(d) { return y(d.value); })
                                .style("opacity", 1);

                        bar.append("text")
                            .attr("x", function(d) { return x1(d.name) + x1.rangeBand()/2; })
                            .attr("y", function(d) { return y(d.value) - 15; })
                            .attr("dx", "-.85em")
                            .attr("dy", ".35em")
                            .style("fill", "#333")
                            .text(function(d) { return d.value + '%'; })
                            .style("opacity", 0)
                            .transition().ease("quad")
                                .delay(function(d, i) { return (d.colorId * 2 + i) * 150 })
                                .style("opacity", 1);

                    };

            }
        };
    }]);
