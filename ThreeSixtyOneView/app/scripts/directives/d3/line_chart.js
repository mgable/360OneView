angular.module('ThreeSixtyOneView.directives')
    .directive('msLineChart', ['d3Service', function(d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: "=chartData"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    // setup variables
                    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
                        width = 659 - margin.left - margin.right,
                        height = 180 - margin.top - margin.bottom;

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

                        // remove svg element
                        svg.selectAll("*").remove();

                        // setup x scale
                        var x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .1);

                        // setup y scale
                        var y = d3.scale.linear()
                            .rangeRound([height, 0]);

                        // setup color scale
                        var color = d3.scale.ordinal()
                            .domain(["1", "2", "3", "4"])
                            .range(["#125db6", "#068700", "#26c6da", "#26a69a"]);

                        // setup xAxis
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .tickSize(0, 0)
                            .orient("bottom");

                        // setup line generator
                        var line = d3.svg.line()
                            .interpolate("cardinal")
                            .x(function(d) { return x(d.label) + x.rangeBand() / 2; })
                            .y(function(d) { return y(d.value); });

                        var labelVar = 'quarter';
                        var varNames = d3.keys(data[0]).filter(function(key) { return key !== labelVar; });
                        color.domain(varNames);

                        var seriesData = varNames.map(function(name) {
                            return {
                                name: name,
                                values: data.map(function(d) {
                                    return {
                                        name: name,
                                        label: d[labelVar],
                                        value: +d[name],
                                    };
                                })
                            };
                        });

                        x.domain(data.map(function(d) { return d.quarter; }));
                        y.domain([0, d3.max(seriesData, function(c) {
                                return d3.max(c.values, function(d) {
                                    return d.value;
                                });
                            })
                        ]);

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        var series = svg.selectAll(".series")
                            .data(seriesData)
                            .enter().append("g")
                            .attr("class", "series")
                            .attr("data-series", function(d) {
                                return d.name;
                            })
                            .on("mouseover", function() {
                                d3.select(this).selectAll("path")
                                    .style("stroke-width", "6px")
                                    .style("opacity", 0.7);
                                d3.select(this).selectAll(".point")
                                    .style("opacity", 1);
                            })
                            .on("mouseout", function() {
                                d3.select(this).selectAll("path")
                                    .style("stroke-width", "2px")
                                    .style("opacity", 0.3);
                                d3.select(this).selectAll(".point")
                                    .style("opacity", 0.7);
                            });

                        series.append("path")
                            .attr("class", "line")
                            .style("stroke", function(d) { return d3.rgb(color(d.name)).brighter(1); })
                            .style("stroke-width", "2px")
                            .style("fill", "none")
                            .style("opacity", 0.3)
                            .attr("d", function(d) { return line(d.values); });

                        series.selectAll(".point")
                            .data(function(d) { return d.values; })
                            .enter().append("circle")
                            .attr("class", "point")
                            .attr("cx", function(d) { return x(d.label) + x.rangeBand() / 2; })
                            .attr("cy", function(d) { return y(d.value); })
                            .attr("r", 0)
                            .style("fill", function(d) { return color(d.name); })
                            .style("opacity", 0)
                            .transition().ease("quad")
                                .delay(function(d, i) { return i * 100 })
                                .attr("r", "5px")
                                .style("opacity", 1);

                        series.selectAll(".label")
                            .data(function(d) { return d.values; })
                            .enter().append("text")
                            .attr("class", "label")
                            .attr("x", function(d) { return x(d.label) + x.rangeBand() / 2 + 5; })
                            .attr("y", function(d) { return y(d.value) - 5; })
                            .attr("dy", ".35em")
                            .style("opacity", 0)
                            .text(function(d) { return d.value + '%'; })
                            .transition().ease("quad")
                                .delay(function(d, i) { return i * 100 })
                                .style("opacity", 0.7);

                        var legend = svg.selectAll(".legend")
                                .data(varNames.slice().reverse())
                            .enter().append("g")
                                .attr("class", "legend")
                                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
                                .on("mouseover", function(d) {
                                    d3.select(this)
                                        .style("opacity", 1);
                                    var sel_path = d3.selectAll('.series[data-series="' + d + '"]').selectAll("path");
                                    sel_path
                                        .style("stroke-width", "6px")
                                        .style("opacity", 0.7);
                                    var sel_point = d3.selectAll('.series[data-series="' + d + '"]').selectAll(".point");
                                    sel_point
                                        .style("opacity", 1);
                                })
                                .on("mouseout", function(d) {
                                    d3.select(this)
                                        .style("opacity", 0.7);
                                    var sel_path = d3.selectAll('.series[data-series="' + d + '"]').selectAll("path");
                                    sel_path
                                        .style("stroke-width", "2px")
                                        .style("opacity", 0.3);
                                    var sel_point = d3.selectAll('.series[data-series="' + d + '"]').selectAll(".point");
                                    sel_point
                                        .style("opacity", 0.7);
                                });

                        legend.append("rect")
                            .attr("x", width)
                            .attr("width", 10)
                            .attr("height", 10)
                            .style("fill", color)
                            .style("opacity", 0.7);

                        legend.append("text")
                            .attr("x", width - 5)
                            .attr("y", 6)
                            .attr("dy", ".25em")
                            .style("text-anchor", "end")
                            .text(function (d) { return d; });

                        // // update state
                        // d3.selectAll('.line').transition()
                        //     .attr('d', function(d) { return line(d.values); });
                        // d3.selectAll(".point").transition()
                        //     .attr("cx", function(d) { return x(d.label) + x.rangeBand() / 2; })
                        //     .attr("cy", function(d) { return y(d.value); });
                        // d3.selectAll('.label').transition()
                        //     .attr("x", function(d) { return x(d.label) + x.rangeBand() / 2 + 10; })
                        //     .attr("y", function(d) { return y(d.value) - 10; })
                        //     .text(function(d) { return d.value + '%'; });

                        // // exit state
                        // series.exit().remove();

                    };

                });
            }
        };
    }]);
