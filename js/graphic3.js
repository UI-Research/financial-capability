var VALUES = ["income3", "income2", "income1"];
var LABELS = {
    income1: "Low income",
    income2: "Middle income",
    income3: "High income"
};
var LABELS_MOBILE = {
    "$0": "$0",
    "$1-$1,999": "$1-$2k",
    "$2,000-$4,999": "$2k-$5k",
    "$5,000-$19,999": "$5k-$20k",
    "$20,000+": "$20k+"
};


var graphtext = {
    graph1: "Low-income families experience some hardship after an income disruption, but more savings help lessen the blow.",
    graph2: "High-income families experience less hardship overall, but the savings pattern still stands.",
    graph3: "It’s the same story for middle-income families.",
    graph4: "Income matters, but when it comes to weathering financial shocks, savings are key.",
    graph5: "In fact, a low-income family with modest savings is better off than a middle-income family living paycheck to paycheck."
}

function buttonStyle(step) {

    d3.selectAll(".button.num").classed("greyed", true);
    d3.select(".button.b" + step).classed("greyed", false);

    if (step == 1) {
        d3.select("#btnprev").classed("greyed", true);
    } else if (step != 1) {
        d3.select("#btnprev").classed("greyed", false);
    }
    if (step == 5) {
        d3.select("#btnnext").classed("greyed", true);
    } else if (step != 5) {
        d3.select("#btnnext").classed("greyed", false);
    }

}

var graph = "graph";
var step = 1;
buttonStyle(1);
var timelapse;

function drawGraphic3(container_width) {
    var d = new Date();
    var t = d.getTime();
    var timer = t;

    function resetTime() {
        d = new Date();
        t = d.getTime();
        timelapse = t - timer;
        timer = t;
    }

    d3.select('#btnnext')
        .on("click", function () {
            resetTime();
            graphChange("next", timelapse);
        });

    d3.select('#btnprev')
        .on("click", function () {
            resetTime();
            graphChange("prev", timelapse);
        });

    //on changing the step, change the graph
    function graphChange(direction, tl) {
        if (direction == "next") {
            step = step < 5 ? step + 1 : step;
        } else if (direction == "prev") {
            step = step > 1 ? step - 1 : step;
        }
        buttonStyle(step);
        switch (step) {
        case 1:
            console.log(tl);
            graph1(direction);
            break;
        case 2:
            console.log(tl);
            if (tl <= 2200) {
                console.log("FOO")
                setTimeout(function () {
                    graph2(direction);
                }, 2200 - tl);
            } else {
                graph2(direction);
            }
            //setTimeout(function () {
            //    graph2(direction);
            //}, 2000);
            break;
        case 3:
            console.log(tl);
            if (tl <= 4200) {
                console.log("BAR")
                setTimeout(function () {
                    graph3(direction);
                }, 4200 - tl);
            } else {
                graph3(direction);
            }
            break;
        case 4:
            console.log(tl);
            if (tl <= 4200) {
                setTimeout(function () {
                    graph4(direction);
                }, 4200 - tl);
            } else {
                graph4(direction);
            }
            break;
        case 5:
            console.log(tl);
            if (tl <= 4200) {
                setTimeout(function () {
                    graph5(direction);
                }, 4200 - tl);
            } else {
                graph5(direction);
            }
            break;
        }
    }

    data.forEach(function (d) {
        d.income1 = +d.income1;
        d.income2 = +d.income2;
        d.income3 = +d.income3;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var padding = 20;

    if (container_width <= MOBILE_THRESHOLD) {
        isMobile = true;
        var chart_aspect_height = 1.75;
        var margin = {
            top: 125,
            right: 20,
            bottom: 15,
            left: 60
        };
        var legspacing = 25;
        var width = container_width - margin.left - margin.right,
            height = Math.min(500, (Math.ceil(width * chart_aspect_height))) - margin.top - margin.bottom - padding;
    } else {
        isMobile = false;
        var chart_aspect_height = 0.6;
        var margin = {
            top: 80,
            right: 20,
            bottom: 15,
            left: 100
        };
        var legspacing = 130;
        var width = container_width - margin.left - margin.right,
            height = Math.ceil(Math.max(350, width * chart_aspect_height)) - margin.top - margin.bottom - padding;
    }

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + padding)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0 + padding], .1)
        .domain(data.map(function (d) {
            return d.assets;
        }));

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.income1;
        })]);

    //annotate: main point is that low income with assets have less hardship than high income without assets
    var annotateshape = svg.selectAll(".annotateshape")
        .data(VALUES)
        .enter()
        .append("g")

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickFormat(function (d) {
            if (isMobile) {
                return LABELS_MOBILE[d];
            } else {
                return d;
            }
        })
        .orient("left");

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(height)
        .tickFormat(d3.format("%"))
        .ticks(4)
        .orient("top");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("text")
        //.attr("y", -10)
        .attr("dx", -4);

    //label axis
    var axistitley = svg.append("text")
        .attr("class", "axistitle")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .text("Savings");

    var axistitlex = svg.append("text")
        .attr("class", "axistitle")
        .attr("x", x(0.15))
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .text("Share experiencing hardship");

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    gx.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    var circleradius = 7;

    var lines = svg.selectAll(".line")
        .data(data)
        .enter()
        .append("g");

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar");

    var circles = svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("g")

    //transition durations
    var rectsquare = 800,
        squarecircle = 700,
        bardelay = 1500,
        barappear = 700;

    function graph1(direction) {

        d3.select("#graphtext")
            .html(graphtext.graph1);

        if (direction == "next") {
            bars.append("rect")
                .attr("class", "income1")
                .attr("x", x(0))
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income1));
                })
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0);

            svg.append("circle")
                .attr("class", function (d) {
                    return "income1";
                })
                .attr("id", "legcirc1")
                .attr("r", circleradius)
                .attr("cx", 10)
                .attr("cy", -50)
                .on("mouseover", function (d) {
                    d3.selectAll("rect:not(." + "income1" + ")")
                        .classed("lowlight", true);
                    d3.selectAll(".chartline")
                        .classed("lowlight", true);
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".lowlight")
                        .classed("lowlight", false);
                })
                .on("mouseleave", function (d) {
                    d3.selectAll(".lowlight")
                        .classed("lowlight", false);
                });

            svg.append("text")
                .attr("class", "legend")
                .attr("id", "legtext1")
                .attr("x", 20)
                .attr("y", -45)
                .attr("text-anchor", "start")
                .text(function (d, i) {
                    return LABELS["income1"];
                });

        } else if (direction == "prev") {

            d3.selectAll("rect.income3")
                .transition()
                .duration(barappear)
                .attr("width", 0)
                .remove()

            d3.selectAll("#legcirc3, #legtext3")
                .transition()
                .duration(barappear)
                .attr("opacity", 0)
                .remove()

            d3.select("#legcirc1")
                .transition()
                .delay(barappear + squarecircle)
                .duration(rectsquare)
                .attr("cx", 0 * legspacing + 10)

            d3.select("#legtext1")
                .transition()
                .delay(barappear + squarecircle)
                .duration(rectsquare)
                .attr("x", 0 * legspacing + 20)

            d3.selectAll("rect.income1")
                .transition()
                .delay(barappear)
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius)
                .transition()
                .duration(rectsquare)
                .attr("x", x(0))
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income1));
                });
        }
    }

    function graph2(direction) {

        d3.select("#graphtext")
            .html(graphtext.graph2);

        if (direction == "next") {

            //turn bars into circles
            d3.selectAll("rect.income1")
                .transition()
                .duration(rectsquare)
                .attr("x", function (d) {
                    return x(d.income1) - circleradius;
                })
                .attr("width", 2 * circleradius)
                .attr("height", 2 * circleradius)
                .attr("y", function (d) {
                    return y(d.assets) + y.rangeBand() / 2 - circleradius;
                })
                .transition()
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius);
            /*.on("mouseover", function (d) {
                //make all the other circles and lines less visible
                d3.selectAll("circle:not(." + d3.select(this).attr("class") + ")")
                    .classed("lowlight", true);
                d3.selectAll(".chartline")
                    .classed("lowlight", true);
            })
            .on("mouseout", function (d) {
                d3.selectAll(".lowlight")
                    .classed("lowlight", false);
            })
            .on("mouseleave", function (d) {
                d3.selectAll(".lowlight")
                    .classed("lowlight", false);
            });*/

            if (isMobile) {

                svg.append("circle")
                    .attr("id", "legcirc3")
                    /*.attr("opacity", 0)*/
                    .attr("class", function (d) {
                        return "income3";
                    })
                    .attr("r", circleradius)
                    .attr("cx", 10)
                    .attr("cy", -margin.top)
                    .on("mouseover", function (d) {
                        d3.selectAll("rect:not(." + "income3" + ")")
                            .classed("lowlight", true);
                        d3.selectAll(".chartline")
                            .classed("lowlight", true);
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    })
                    .on("mouseleave", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    });

                d3.select("#legcirc3")
                    .transition()
                    .duration(rectsquare)
                    .attr("cy", -2 * legspacing - 50);

                svg.append("text")
                    //.transition()
                    //.delay(bardelay)
                    .attr("class", "legend")
                    .attr("id", "legtext3")
                    .attr("x", 20)
                    .attr("y", -margin.top + 5)
                    .attr("text-anchor", "start")
                    .text(function (d, i) {
                        return LABELS["income3"];
                    })
                    .transition()
                    .duration(rectsquare)
                    .attr("y", -2 * legspacing - 45);

            } else {
                //transition the legend items over to final posiition
                d3.select("#legcirc1")
                    .transition()
                    .duration(rectsquare)
                    .attr("cx", 2 * legspacing + 10)

                d3.select("#legtext1")
                    .transition()
                    .duration(rectsquare)
                    .attr("x", 2 * legspacing + 20)

                svg.append("circle")
                    .attr("id", "legcirc3")
                    /*.attr("opacity", 0)*/
                    .attr("class", function (d) {
                        return "income3";
                    })
                    .attr("r", circleradius)
                    .attr("cx", -margin.left)
                    .attr("cy", -50)
                    .on("mouseover", function (d) {
                        d3.selectAll("rect:not(." + "income3" + ")")
                            .classed("lowlight", true);
                        d3.selectAll(".chartline")
                            .classed("lowlight", true);
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    })
                    .on("mouseleave", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    });

                d3.select("#legcirc3")
                    .transition()
                    .duration(rectsquare)
                    .attr("cx", 0 * legspacing + 10);

                svg.append("text")
                    //.transition()
                    //.delay(bardelay)
                    .attr("class", "legend")
                    .attr("id", "legtext3")
                    .attr("x", -margin.left + 10)
                    .attr("y", -45)
                    .attr("text-anchor", "start")
                    .text(function (d, i) {
                        return LABELS["income3"];
                    })
                    .transition()
                    .duration(rectsquare)
                    .attr("x", 0 * legspacing + 20);
            }

            bars.append("rect")
                .transition()
                .delay(bardelay)
                .attr("class", "income3")
                .attr("x", x(0))
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", 0)
                .transition()
                .duration(barappear)
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income3));
                });
        } else if (direction == "prev") {

            d3.selectAll("rect.income2")
                .transition()
                .duration(barappear)
                .attr("width", 0)
                .remove()

            d3.selectAll("#legcirc2, #legtext2")
                .transition()
                .duration(barappear)
                .attr("opacity", 0)
                .remove()

            d3.selectAll("rect.income3")
                .transition()
                .delay(barappear)
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius)
                .transition()
                .duration(rectsquare)
                .attr("x", x(0))
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income3));
                });
        }
    }

    function graph3(direction) {

        d3.select("#graphtext")
            .html(graphtext.graph3);

        if (direction == "next") {
            d3.selectAll("rect.income3")
                .transition()
                .duration(rectsquare)
                .attr("x", function (d) {
                    return x(d.income3) - circleradius;
                })
                .attr("width", 2 * circleradius)
                .attr("height", 2 * circleradius)
                .attr("y", function (d) {
                    return y(d.assets) + y.rangeBand() / 2 - circleradius;
                })
                .transition()
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius);

            bars.append("rect")
                .transition()
                .delay(bardelay)
                .attr("class", "income2")
                .attr("x", x(0))
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", 0)
                .transition()
                .duration(barappear)
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income2));
                });

            if (isMobile) {
                svg.append("circle")
                    .attr("id", "legcirc2")
                    /*.attr("opacity", 0)*/
                    .attr("class", function (d) {
                        return "income2";
                    })
                    .attr("r", circleradius)
                    .attr("cx", 10)
                    .attr("cy", -margin.top)
                    .on("mouseover", function (d) {
                        d3.selectAll("rect:not(." + "income2" + ")")
                            .classed("lowlight", true);
                        d3.selectAll(".chartline")
                            .classed("lowlight", true);
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    })
                    .on("mouseleave", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    });

                d3.select("#legcirc2")
                    .transition()
                    .duration(rectsquare)
                    .attr("cy", -1 * legspacing - 50);

                svg.append("text")
                    //.transition()
                    //.delay(bardelay)
                    .attr("class", "legend")
                    .attr("id", "legtext2")
                    .attr("x", 20)
                    .attr("y", -margin.top + 5)
                    .attr("text-anchor", "start")
                    .text(function (d, i) {
                        return LABELS["income2"];
                    })
                    .transition()
                    .duration(rectsquare)
                    .attr("y", -1 * legspacing - 45);

            } else {
                svg.append("circle")
                    .attr("id", "legcirc2")
                    //.attr("opacity", 0)
                    .attr("class", function (d) {
                        return "income2";
                    })
                    .attr("r", circleradius)
                    .attr("cx", 1 * legspacing + 10)
                    .attr("cy", -margin.top)
                    .on("mouseover", function (d) {
                        d3.selectAll("rect:not(." + "income2" + ")")
                            .classed("lowlight", true);
                        d3.selectAll(".chartline")
                            .classed("lowlight", true);
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    })
                    .on("mouseleave", function (d) {
                        d3.selectAll(".lowlight")
                            .classed("lowlight", false);
                    });

                d3.select("#legcirc2")
                    .transition()
                    .duration(rectsquare)
                    .attr("cy", -50)

                svg.append("text")
                    //.transition()
                    //.delay(bardelay)
                    .attr("class", "legend")
                    .attr("id", "legtext2")
                    .attr("x", 1 * legspacing + 20)
                    .attr("y", -margin.top + 5)
                    .attr("text-anchor", "start")
                    .text(function (d, i) {
                        return LABELS["income2"];
                    })
                    .transition()
                    .duration(rectsquare)
                    .attr("y", -45)
            }

        } else if (direction == "prev") {
            d3.selectAll(".chartline")
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove()

            d3.selectAll("rect.income2")
                .transition()
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius)
                .transition()
                .duration(rectsquare)
                .attr("x", x(0))
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d.income2));
                });
        }
    }

    function graph4(direction) {
        d3.select("#graphtext")
            .html(graphtext.graph4);

        if (direction == "next") {
            d3.selectAll("rect.income2")
                .transition()
                .duration(rectsquare)
                .attr("x", function (d) {
                    return x(d.income2) - circleradius;
                })
                .attr("width", 2 * circleradius)
                .attr("height", 2 * circleradius)
                .attr("y", function (d) {
                    return y(d.assets) + y.rangeBand() / 2 - circleradius;
                })
                .transition()
                .duration(squarecircle)
                .attr("rx", 2 * circleradius)
                .attr("ry", 2 * circleradius);

            for (i = 0; i < (VALUES.length - 1); i++) {
                lines.append("line")
                    .transition()
                    .delay(bardelay)
                    .attr("class", "chartline")
                    .style("stroke-dasharray", "3,3")
                    .attr("y1", function (d) {
                        return y(d.assets) + y.rangeBand() / 2;
                    })
                    .attr("y2", function (d) {
                        return y(d.assets) + y.rangeBand() / 2;
                    })
                    .attr("x1", function (d) {
                        return x(d[VALUES[i]]);
                    })
                    .attr("x2", function (d) {
                        return x(d[VALUES[i]]);
                    })
                    .transition()
                    .duration(500)
                    .attr("x2", function (d) {
                        return x(d[VALUES[i + 1]]);
                    });
            }
        } else if (direction == "prev") {
            d3.selectAll("ellipse")
                .transition()
                .duration(barappear)
                .attr("opacity", 0)
                .remove()

            d3.selectAll(".annotate-line")
                .transition()
                .duration(barappear)
                .attr("opacity", 0)
                .remove()

        }
    }

    function graph5() {
        d3.select("#graphtext")
            .html(graphtext.graph5);

        if (isMobile) {
            annotateshape.append("line")
                .attr("class", "annotate-line")
                .attr("opacity", 0)
                .attr("id", "annontateshape")
                .attr("y1", y("$2,000-$4,999") + 0.5 * y.rangeBand())
                .attr("y2", y("$0") + 0.5 * y.rangeBand())
                .attr("x1", x(0.20))
                .attr("x2", x(0.30))
                .transition()
                .duration(barappear)
                .attr("opacity", 1);

        } else {
            annotateshape.append("ellipse")
                .attr("class", "annotate-shape")
                .attr("opacity", 0)
                .attr("id", "annontateshape")
                .attr("cx", x(0.25))
                .attr("cy", 3 * y.rangeBand())
                .attr("rx", x(0.10))
                .attr("ry", 0.75 * y.rangeBand())
                .attr("transform", "translate(" + x(0.08) + "," + -2.8 * y.rangeBand() + ") rotate(30)")
                .transition()
                .duration(barappear)
                .attr("opacity", 1);
        }
    }

    graph1("next");

}