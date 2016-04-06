var MOBILE_THRESHOLD = 600;
var graphic1_data_url = "data/graphic1.csv";
var graphic2_data_url = "data/graphic2.csv";
var graphic3a_data_url = "data/graphic3a.csv";
var graphic3_data_url = "data/graphic3.csv";
var isMobile = false;
var $graphic = $('#graphic');
var COLORS = ["#1696d2", "#d2d2d2"];
var numticks = 6;
var HARDSHIPS = {
    hardship1: "Received public benefits",
    hardship2: "Missed utility payment",
    hardship3: "Missed housing payment",
    hardship4: "Evicted"
};
var MONEY_MOBILE = ["$0", "$1- $249", "$250- $749", "$750- $2k", "$2k - $5k", "$5k- $20k", "$20k+"];

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function wrap2(text, width, startingx) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = lineHeight * 1.2
            //dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", startingx).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", startingx).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

//vertical bar chart of savings distribution
function drawGraphic1(container_width) {

    data.forEach(function (d) {
        d.share = +d.share;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    if (container_width <= MOBILE_THRESHOLD) {
        isMobile = true;
        var chart_aspect_height = 1.2;
        var margin = {
            top: 135,
            right: 20,
            bottom: 55,
            left: 5
        };
    } else {
        isMobile = false;
        var chart_aspect_height = 0.6;
        var margin = {
            top: 85,
            right: 20,
            bottom: 55,
            left: 15
        };
    }

    var width = container_width - margin.left - margin.right,
        height = Math.ceil(width * chart_aspect_height) - margin.top - margin.bottom;

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function (d) {
            return d.share;
        })]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function (d) {
            return d.assets;
        }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickFormat(function (d, i) {
            if (isMobile) {
                return MONEY_MOBILE[i];
            } else {
                return d;
            }
        })
        .orient("bottom");

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis-show")
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, x.rangeBand());

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar");

    bars.append("rect")
        .attr("x", function (d) {
            return x(d.assets);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.share);
        })
        .attr("height", function (d) {
            return height - y(d.share);
        })

    var barlabels = svg.selectAll(".point-label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "point-label");

    barlabels.append("text")
        .attr("y", function (d) {
            return y(d.share) - 8;
        })
        .attr("x", function (d) {
            return x(d.assets) + x.rangeBand() / 2;
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d3.format("%")(d.share);
        });

    if (isMobile) {
        var annotatey = -margin.top;
    } else {
        var annotatey = -92;
    }


    var annotation = svg.append("text")
        .attr("class", "annotation")
        .attr("y", annotatey)
        .attr("text-anchor", "middle")
        .text("More than half of families have less than $2,000 in nonretirement savings")
        .call(wrap2, width / 2, 2.25 * x.rangeBand());

    svg.append("line")
        .attr("class", "annotate-line")
        .attr("x1", x("$0"))
        .attr("x2", x("$750 - $1,999") + x.rangeBand())
        .attr("y1", -47)
        .attr("y2", -47);

    svg.append("line")
        .attr("class", "annotate-line")
        .attr("x1", x("$0"))
        .attr("x2", x("$0"))
        .attr("y1", -10)
        .attr("y2", -48);

    svg.append("line")
        .attr("class", "annotate-line")
        .attr("x1", x("$750 - $1,999") + x.rangeBand())
        .attr("x2", x("$750 - $1,999") + x.rangeBand())
        .attr("y1", y(0.1))
        .attr("y2", -48);

    svg.append("line")
        .attr("class", "annotate-line")
        .attr("x1", x("$1 - $249") + x.rangeBand())
        .attr("x2", x("$1 - $249") + x.rangeBand())
        .attr("y1", -55)
        .attr("y2", -47);
}

//horizontal grouped bar chart - not using
function drawGraphic2(container_width) {

    var LABELS = ["Families who experienced income disruptions", "Families without income disruptions"];
    var VALUES = ["shocks1", "shocks0"]

    data.forEach(function (d) {
        d.shocks1 = +d.shocks1;
        d.shocks0 = +d.shocks0;
    });


    var color = d3.scale.ordinal()
        .range(COLORS);

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 1;
    var margin = {
        top: 70,
        right: 40,
        bottom: 45,
        left: 100
    };

    var width = container_width - margin.left - margin.right,
        height = Math.max((400 - margin.top - margin.bottom), (Math.ceil(width * chart_aspect_height) - margin.top - margin.bottom));

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .18);

    var y1 = d3.scale.ordinal();

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.shocks1;
        })]);

    data.forEach(function (d) {
        d.vals = VALUES.map(function (name) {
            return {
                name: name,
                value: +d[name]
            };
        });
    });

    y0.domain(data.map(function (d) {
        return d.hardship;
    }));

    y1.domain(VALUES).rangeRoundBands([0, y0.rangeBand()]);

    x.domain([0, d3.max(data, function (d) {
        return d3.max(d.vals, function (d) {
            return d.value;
        });
    })]);

    var yAxis = d3.svg.axis()
        .scale(y0)
        .tickSize(0)
        .tickFormat(function (d) {
            return HARDSHIPS[d];
        })
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis-show")
        .call(yAxis)
        .selectAll(".tick text")
        .attr("transform", function (d) {
            return "translate(0," + -0.25 * y0.rangeBand() + ")";
        })
        .call(wrap2, 90, -5);


    var bars = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function (d) {
            return "translate(0," + y0(d.hardship) + ")";
        });

    bars.selectAll("rect")
        .data(function (d) {
            return d.vals;
        })
        .enter().append("rect")
        .attr("height", y1.rangeBand())
        .attr("y", function (d) {
            return y1(d.name);
        })
        .attr("x", x(0))
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("fill", function (d) {
            return color(d.name);
        });

    bars.selectAll("text")
        .data(function (d) {
            return d.vals;
        })
        .enter().append("text")
        .attr("class", "point-label")
        .attr("y", function (d) {
            return y1(d.name) + y1.rangeBand() / 2 + 4;
        })
        .attr("x", function (d) {
            return x(d.value) + 6;
        })
        .attr("text-anchor", "start")
        .text(function (d) {
            return d3.format("%")(d.value);
        });

    var legspacing = 25;

    var legend = svg.selectAll(".legend")
        .data(VALUES)
        .enter()
        .append("g")

    legend.append("rect")
        .attr("fill", color)
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", function (d, i) {
            return i * legspacing - 60;
        })
        .attr("x", 0);

    legend.append("text")
        .attr("class", "legend")
        .attr("y", function (d, i) {
            return i * legspacing - 46;
        })
        .attr("x", 30)
        .attr("text-anchor", "start")
        .text(function (d, i) {
            return LABELS[i];
        });
}

//horizontal split bar chart
function drawGraphic3a(container_width) {
    var LABELS = ["Missed housing payment", "Missed utility payment", "Received public benefits"];
    var VALUES = ["hardship3", "hardship2", "hardship1"];

    data.forEach(function (d) {
        d.hardship1 = +d.hardship1;
        d.hardship2 = +d.hardship2;
        d.hardship3 = +d.hardship3;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    if (container_width <= MOBILE_THRESHOLD) {
        isMobile = true;
        var chart_aspect_height = 4;
        var margin = {
            top: 35,
            right: 45,
            bottom: -35,
            left: 70
        };
        var width = container_width - margin.left - margin.right,
            height = Math.ceil(width * chart_aspect_height) - margin.top - margin.bottom;

    } else {
        isMobile = false;
        var chart_aspect_height = 0.4;
        var margin = {
            top: 55,
            right: 45,
            bottom: 15,
            left: 100
        };
        var width = container_width - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    }

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (isMobile) {
        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return (d[VALUES[2]]);
            })]);

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar");

        var barlabels = svg.selectAll(".point-label")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "point-label");

        var axistitle = svg.append("text")
            .attr("class", "axistitle")
            .attr("x", -5)
            .attr("y", 2)
            .attr("text-anchor", "end")
            .text("Savings");

        for (i = 0; i < VALUES.length; i++) {
            var y = d3.scale.ordinal()
                .rangeRoundBands([(height / 3) * (i + 1) - 45, (height / 3) * i], .1)
                .domain(data.map(function (d) {
                    return d.assets;
                }));

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(0)
                .tickFormat(function (d, i) {
                    return MONEY_MOBILE[i];
                })
                .orient("left");

            var gy = svg.append("g")
                .attr("class", "y axis-show")
                .call(yAxis);

            gy.selectAll("text")
                .attr("dx", -4);

            svg.append("text")
                .attr("class", "subtitle")
                .attr("x", 0)
                .attr("y",  (height / 3) * i - 12)
                .attr("text-anchor", "start")
                .text(LABELS[i])
                .call(wrap, width);

            bars.append("rect")
                .attr("class", VALUES[i] + "_0")
                .attr("x", x(0))
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d[VALUES[i]]));
                })
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())

            barlabels.append("text")
                .attr("x", function (d) {
                    return x(d[VALUES[i]]) + 4;
                })
                .attr("y", function (d) {
                    return y(d.assets) + y.rangeBand() / 2 + 4;
                })
                .text(function (d) {
                    return d3.format("%")(d[VALUES[i]]);
                });
        }
    } else {
        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.assets;
            }));

        var max = [];
        //calculate spacing of segments
        for (i = 0; i < VALUES.length; i++) {
            max[i] = d3.max(data, function (d) {
                return (d[VALUES[i]]);
            });
        }
        var prop = [];
        for (i = 0; i < VALUES.length; i++) {
            prop[i] = 0.75 * max[i] / (max[0] + max[1] + max[2]);
        }

        var padding = 65;

        var STARTS = [0, width * prop[0], width * (prop[0] + prop[1]), width * (prop[0] + prop[1] + prop[2])];

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis-show")
            .call(yAxis);

        gy.selectAll("text")
            .attr("dx", -4);

        //label axis
        var axistitle = svg.append("text")
            .attr("class", "axistitle")
            .attr("x", -5)
            .attr("y", 2)
            .attr("text-anchor", "end")
            .text("Savings");

        //in a loop bc .call was broken otherwise
        for (i = 0; i < VALUES.length; i++) {
            svg.append("text")
                .attr("class", "subtitle")
                .attr("x", STARTS[i] + i * padding)
                .attr("y", -50)
                .attr("text-anchor", "start")
                .text(LABELS[i])
                .call(wrap2, width / 4, STARTS[i] + i * padding);
        }

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar");

        var barlabels = svg.selectAll(".point-label")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "point-label");

        for (i = 0; i < VALUES.length; i++) {
            var x = d3.scale.linear()
                .range([STARTS[i] + (i * padding), STARTS[i + 1] + (i * padding)])
                .domain([0, max[i]]);

            bars.append("rect")
                .attr("class", VALUES[i] + "_0")
                .attr("x", x(0))
                .attr("width", function (d) {
                    return Math.abs(x(0) - x(d[VALUES[i]]));
                })
                .attr("y", function (d) {
                    return y(d.assets);
                })
                .attr("height", y.rangeBand())

            barlabels.append("text")
                .attr("x", function (d) {
                    return x(d[VALUES[i]]) + 4;
                })
                .attr("y", function (d) {
                    return y(d.assets) + y.rangeBand() / 2 + 4;
                })
                .text(function (d) {
                    return d3.format("%")(d[VALUES[i]]);
                });
        }
    }


}