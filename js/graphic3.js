var VALUES = ["income3", "income2", "income1"];
var LABELS = {
    income1: "Low income",
    income2: "Middle income",
    income3: "High income"
};
var ASSETGROUPS = {
    "$0": "a1",
    "$1-$2,000": "a2",
    "$2,000-$4,999": "a3",
    "$5,000-$19,999": "a4",
    "$20,000+": "a5"
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

function drawGraphic3(container_width) {
    $('#btnnext').click(function () {
        graphChange("next");
    });

    $('#btnprev').click(function () {
        graphChange("prev");
    });

    //on changing the step, change the graph
    function graphChange(direction) {
        if (direction == "next") {
            step = step < 5 ? step + 1 : step;
        } else if (direction == "prev") {
            step = step > 1 ? step - 1 : step;
        }
        buttonStyle(step);
        switch (step) {
        case 1:
            graph1();
            break;
        case 2:
            graph2();
            break;
        case 3:
            graph3();
            break;
        case 4:
            graph4();
            break;
        case 5:
            graph5();
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

    var margin = {
        top: 80,
        right: 20,
        bottom: 15,
        left: 100
    };
    var padding = 20,
        chart_aspect_height = 0.6;
    var width = container_width - margin.left - margin.right,
        height = Math.ceil(Math.max(350, width * chart_aspect_height)) - margin.top - margin.bottom - padding;

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
        .orient("left");

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(height)
        .tickFormat(d3.format("%"))
        .ticks(5)
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

    var legspacing = 130;

    /*var legend = svg.selectAll(".legend")
        .data(VALUES[2])
        .enter()
        .append("g")

    legend.append("circle")
        .attr("class", function (d) {
            return d;
        })
        .attr("r", circleradius)
        .attr("cx", function (d, i) {
            return i * legspacing + 10;
        })
        .attr("cy", -50)
        .on("mouseover", function (d) {
            d3.selectAll("rect:not(." + d + ")")
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

    legend.append("text")
        .attr("class", "legend")
        .attr("x", function (d, i) {
            return i * legspacing + 20;
        })
        .attr("y", -45)
        .attr("text-anchor", "start")
        .text(function (d, i) {
            return LABELS[d];
        });*/

    //transition durations
    var rectsquare = 800,
        squarecircle = 700,
        bardelay = 1500,
        barappear = 700;

    function graph1() {
        d3.select("#graphtext")
            .html(graphtext.graph1);

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
            .attr("cx", function (d, i) {
                return 0 * legspacing + 10;
            })
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
            .attr("x", function (d, i) {
                return 0 * legspacing + 20;
            })
            .attr("y", -45)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return LABELS["income1"];
            });
    }

    function graph2() {
        d3.select("#graphtext")
            .html(graphtext.graph2);

        //transition the legend items over to final posiition
        d3.select("#legcirc1")
            .transition()
            .duration(rectsquare)
            .attr("cx", function (d, i) {
                return 2 * legspacing + 10;
            })

        d3.select("#legtext1")
            .transition()
            .duration(rectsquare)
            .attr("x", function (d, i) {
                return 2 * legspacing + 20;
            })

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
                return y(d.assets) + y.rangeBand() / 3;
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

        svg.append("circle")
            .attr("id", "legcirc3")
            .attr("opacity", 0)
            .attr("class", function (d) {
                return "income3";
            })
            .attr("r", circleradius)
            .attr("cx", function (d, i) {
                return 0 * legspacing + 10;
            })
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
            .delay(bardelay)
            .duration(1)
            .attr("opacity", 1)

        svg.append("text")
            .transition()
            .delay(bardelay)
            .attr("class", "legend")
            .attr("id", "legtext3")
            .attr("x", function (d, i) {
                return 0 * legspacing + 20;
            })
            .attr("y", -45)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return LABELS["income3"];
            });

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

    }

    function graph3() {
        d3.select("#graphtext")
            .html(graphtext.graph3);

        d3.selectAll("rect.income3")
            .transition()
            .duration(rectsquare)
            .attr("x", function (d) {
                return x(d.income3) - circleradius;
            })
            .attr("width", 2 * circleradius)
            .attr("height", 2 * circleradius)
            .attr("y", function (d) {
                return y(d.assets) + y.rangeBand() / 3;
            })
            .transition()
            .duration(squarecircle)
            .attr("rx", 2 * circleradius)
            .attr("ry", 2 * circleradius);

        svg.append("circle")
            .attr("id", "legcirc2")
            .attr("opacity", 0)
            .attr("class", function (d) {
                return "income2";
            })
            .attr("r", circleradius)
            .attr("cx", function (d, i) {
                return 1 * legspacing + 10;
            })
            .attr("cy", -50)
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
            .delay(bardelay)
            .duration(1)
            .attr("opacity", 1)

        svg.append("text")
            .transition()
            .delay(bardelay)
            .attr("class", "legend")
            .attr("id", "legtext2")
            .attr("x", function (d, i) {
                return 1 * legspacing + 20;
            })
            .attr("y", -45)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return LABELS["income2"];
            });

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

    }

    function graph4() {
        d3.select("#graphtext")
            .html(graphtext.graph4);

        d3.selectAll("rect.income2")
            .transition()
            .duration(rectsquare)
            .attr("x", function (d) {
                return x(d.income2) - circleradius;
            })
            .attr("width", 2 * circleradius)
            .attr("height", 2 * circleradius)
            .attr("y", function (d) {
                return y(d.assets) + y.rangeBand() / 3;
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
    }

    function graph5() {
        d3.select("#graphtext")
            .html(graphtext.graph5);

        annotateshape.append("ellipse")
            .attr("class", "annotate-shape")
            .attr("id", "annontateshape")
            .attr("cx", x(0.25))
            .attr("cy", 3 * y.rangeBand())
            .attr("rx", x(0.10))
            .attr("ry", 0.75 * y.rangeBand())
            .attr("transform", "translate(" + x(0.08) + "," + -2.8 * y.rangeBand() + ") rotate(30)")

    }

    graph1();

}