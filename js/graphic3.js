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
    graph1: "Lorem ipsum 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    graph2: "Lorem ipsum 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    graph3: "Lorem ipsum 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    graph4: "Lorem ipsum 4 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    graph5: "Lorem ipsum 5 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}

var graph = "graph";
var step = 1;
buttonStyle(1);

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

//on changing the step, change the graph
function graphChange() {
    step = step < 5 ? step + 1 : step;
    buttonStyle(step);
    window[graph + step]();
}

$('#btnnext').click(function () {
    graphChange();
});

function drawGraphic3(container_width) {


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
        right: 80,
        bottom: 15,
        left: 100
    };
    var padding = 20,
        chart_aspect_height = 0.5;
    var width = container_width - margin.left - margin.right,
        height = Math.ceil(width * chart_aspect_height) - margin.top - margin.bottom - padding;

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
        .attr("y", -15)
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

    var legend = svg.selectAll(".legend")
        .data(VALUES)
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
            d3.selectAll("circle:not(." + d + ")")
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
        });

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
    }

    function graph2() {
        d3.select("#graphtext")
            .html(graphtext.graph2);

        bars.append("rect")
            .attr("class", "income2")
            .attr("x", x(0))
            .attr("width", function (d) {
                return Math.abs(x(0) - x(d.income2));
            })
            .attr("y", function (d) {
                return y(d.assets);
            })
            .attr("height", y.rangeBand())

        circles.append("circle")
            .attr("class", VALUES[2])
            .attr("id", function (d) {
                return VALUES[2] + "_" + ASSETGROUPS[d.assets];
            })
            .attr("r", circleradius)
            .attr("cx", function (d) {
                return x(d[VALUES[2]]);
            })
            .attr("cy", function (d) {
                return y(d.assets) + y.rangeBand() / 3;
            })
            .on("mouseover", function (d) {
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
            });

    }

    function graph3() {
        d3.select("#graphtext")
            .html(graphtext.graph3);

        bars.append("rect")
            .attr("class", "income3")
            .attr("x", x(0))
            .attr("width", function (d) {
                return Math.abs(x(0) - x(d.income3));
            })
            .attr("y", function (d) {
                return y(d.assets);
            })
            .attr("height", y.rangeBand())

        for (i of[1, 2]) {
            circles.append("circle")
                .attr("class", VALUES[i])
                .attr("id", function (d) {
                    return VALUES[i] + "_" + ASSETGROUPS[d.assets];
                })
                .attr("r", circleradius)
                .attr("cx", function (d) {
                    return x(d[VALUES[i]]);
                })
                .attr("cy", function (d) {
                    return y(d.assets) + y.rangeBand() / 3;
                })
                .on("mouseover", function (d) {
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
                });
        }

    }

    function alldots() {
        for (i = 0; i < (VALUES.length - 1); i++) {
            lines.append("line")
                .attr("class", "chartline")
                .attr("y1", function (d) {
                    return y(d.assets) + y.rangeBand() / 3;
                })
                .attr("y2", function (d) {
                    return y(d.assets) + y.rangeBand() / 3;
                })
                .attr("x1", function (d) {
                    return x(d[VALUES[i]]);
                })
                .attr("x2", function (d) {
                    return x(d[VALUES[i + 1]]);
                });
        }

        for (i = 0; i < VALUES.length; i++) {
            circles.append("circle")
                .attr("class", VALUES[i])
                .attr("id", function (d) {
                    return VALUES[i] + "_" + ASSETGROUPS[d.assets];
                })
                .attr("r", circleradius)
                .attr("cx", function (d) {
                    return x(d[VALUES[i]]);
                })
                .attr("cy", function (d) {
                    return y(d.assets) + y.rangeBand() / 3;
                })
                .on("mouseover", function (d) {
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
                });
        }
    }

    function graph4() {
        d3.select("#graphtext")
            .html(graphtext.graph4);
        alldots();
    }

    function graph5() {
        d3.select("#graphtext")
            .html(graphtext.graph5);
        alldots();

        annotateshape.append("rect")
            .attr("class", "annotate-shape")
            .attr("x", x(0.192))
            .attr("y", 2.5 * y.rangeBand())
            .attr("width", x(0.305) - x(0.192))
            .attr("height", 3.6 * y.rangeBand());

        var annotation = svg.append("text")
            .attr("class", "annotation")
            //.attr("x", x(0.10))
            .attr("y", 0.9 * y.rangeBand())
            .attr("text-anchor", "start")
            .text("Being low income with modest savings is better than being higher income and living paycheck to paycheck")
            .call(wrap2, width * 0.4, x(0.19));
    }


    graph5();

}