var MOBILE_THRESHOLD = 700;
var graphic2_data_url = "data/graphic2.csv";
var graphic3a_data_url = "data/graphic3a.csv";
var graphic3_data_url = "data/graphic3.csv";
var isMobile = false;
var $graphic = $('#graphic');
var COLORS = ["#1696d2", "#fdbf11"];
var COLORS3 = ["#fdbf11", "#ccc", "#1696d2"];
var numticks = 6;
var HARDSHIPS = {
    hardship1: "Received public benefits",
    hardship2: "Missed utility payment",
    hardship3: "Missed housing payment",
    hardship4: "Evicted"
};

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

function drawGraphic2(container_width) {

    var LABELS = ["Families who experienced financial shocks", "Families without financial shocks"];
    var VALUES = ["shocks1", "shocks0"]

    data.forEach(function (d) {
        d.shocks1 = +d.shocks1;
        d.shocks0 = +d.shocks0;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 0.4;
    var margin = {
        top: 55,
        right: 15,
        bottom: 45,
        left: 15
    };

    var width = container_width - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function (d) {
            return d.shocks1;
        })]);

    for (i = 0; i < VALUES.length; i++) {
        var x = d3.scale.ordinal()
            .rangeRoundBands(
                [i * (width / 2) + (i * 30), (i + 1) * (width / 2) - ((1 - i) * 30)], .1)
            .domain(data.map(function (d) {
                return d.hardship;
            }));

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .tickFormat(function (d) {
                return HARDSHIPS[d];
            })
            .orient("bottom");

        var gx = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis-show")
            .call(xAxis)
            .selectAll(".tick text")
            .call(wrap, x.rangeBand());

        bars.append("rect")
            .attr("class", function (d) {
                return d.hardship + "_" + i;
            })
            .attr("x", function (d) {
                return x(d.hardship);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d[VALUES[i]]);
            })
            .attr("height", function (d) {
                return height - y(d[VALUES[i]]);
            })

        barlabels.append("text")
            .attr("y", function (d) {
                return y(d[VALUES[i]]) - 8;
            })
            .attr("x", function (d) {
                return x(d.hardship) + x.rangeBand() / 2;
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d3.format("%")(d[VALUES[i]]);
            });

        var titles = svg.append("text")
            .attr("class", "graphtitle")
            .attr("x", i * (30 + width / 2) + 10)
            .attr("y", -30)
            .attr("text-anchor", "start")
            .text(LABELS[i]);
    }
}

/*function drawGraphic2(container_width) {

    data.forEach(function (d) {
        d.shocks1 = +d.shocks1;
        d.shocks0 = +d.shocks0;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 0.4;
    var margin = {
        top: 15,
        right: 80,
        bottom: 15,
        left: 150
    };
    var padding = 20;

    var width = container_width - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom - padding;

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + padding)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0 + padding], .1)
        .domain(data.map(function (d) {
            return d.hardship;
        }));

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.shocks1;
        })]);

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
        .attr("y", -10)
        .attr("dx", -4);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    gx.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    var lines = svg.selectAll(".line")
        .data(data)
        .enter()
        .append("g");

    lines.append("line")
        .attr("class", "chartline")
        .attr("y1", function (d) {
            return y(d.hardship) + y.rangeBand() / 3;
        })
        .attr("y2", function (d) {
            return y(d.hardship) + y.rangeBand() / 3;
        })
        .attr("x1", function (d) {
            return x(d.shocks0);
        })
        .attr("x2", function (d) {
            return x(d.shocks1);
        });

    var circles = svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("g")

    circles.append("circle")
        .attr("r", 5.5)
        .attr("cx", function (d) {
            return x(d.shocks0);
        })
        .attr("cy", function (d) {
            return y(d.hardship) + y.rangeBand() / 3;
        })
        .attr("fill", COLORS[0])

    circles.append("circle")
        .attr("r", 5.5)
        .attr("cx", function (d) {
            return x(d.shocks1);
        })
        .attr("cy", function (d) {
            return y(d.hardship) + y.rangeBand() / 3;
        })
        .attr("fill", COLORS[1])

    var circlelabel = svg.selectAll(".point-label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "point-label")
        .filter(function (d) {
            return d.hardship == "Received public benefits"
        })

    //label top circles
    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.shocks0);
        })
        .attr("y", function (d) {
            return y(d.hardship);
        })
        .attr("text-anchor", "middle")
        .text("No financial shocks");

    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.shocks1);
        })
        .attr("y", function (d) {
            return y(d.hardship);
        })
        .attr("text-anchor", "middle")
        .text("Had a financial shock");

}*/

function drawGraphic3a(container_width) {

    var LABELS = ["Received public benefits", "Missed utility payment", "Missed housing payment"];
    var VALUES = ["hardship1", "hardship2", "hardship3"];

    data.forEach(function (d) {
        d.hardship1 = +d.hardship1;
        d.hardship2 = +d.hardship2;
        d.hardship3 = +d.hardship3;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 0.4;
    var margin = {
        top: 35,
        right: 40,
        bottom: 15,
        left: 100
    };

    var width = container_width - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    $graphic.empty();

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        prop[i] = 0.9 * max[i] / (max[0] + max[1] + max[2]);
    }

    var padding = 40;

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

    var titles = svg.selectAll(".graphtitle")
        .data(LABELS)
        .enter()
        .append("g")
        .attr("class", "graphtitle");

    titles.append("text")
        .attr("x", function (d, i) {
            return STARTS[i] + i * padding;
        })
        .attr("y", -10)
        .attr("text-anchor", "start")
        .text(function (d, i) {
            return d;
        });

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
                return y(d.assets) + y.rangeBand() / 2;
            })
            .text(function (d) {
                return d3.format("%")(d[VALUES[i]]);
            });
    }

}

function drawGraphic3(container_width) {

    var VALUES = ["income1", "income2", "income3"];

    data.forEach(function (d) {
        d.income1 = +d.income1;
        d.income2 = +d.income2;
        d.income3 = +d.income3;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 0.4;
    var margin = {
        top: 15,
        right: 80,
        bottom: 15,
        left: 100
    };
    var padding = 20;

    var width = container_width - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom - padding;

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
        .attr("y", -10)
        .attr("dx", -4);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    gx.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    var lines = svg.selectAll(".line")
        .data(data)
        .enter()
        .append("g");

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

    var circles = svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("g")

    for (i = 0; i < VALUES.length; i++) {
        circles.append("circle")
            .attr("r", 7)
            .attr("cx", function (d) {
                return x(d[VALUES[i]]);
            })
            .attr("cy", function (d) {
                return y(d.assets) + y.rangeBand() / 3;
            })
            .attr("fill", COLORS3[i])
    }

    var circlelabel = svg.selectAll(".point-label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "point-label")
        .filter(function (d) {
            return d.assets == "$20,000+"
        })

    //label top circles
    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.income1);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("text-anchor", "middle")
        .text("Low income");

    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.income2);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("text-anchor", "start")
        .text("Middle income");

    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.income3);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("text-anchor", "end")
        .text("Top income");

    //annotate: main point is that low income with assets have less hardship than high income without assets
    var annotateshape = svg.append("rect")
        .attr("class", "annotate-shape")
        .attr("x", x(0.20))
        .attr("y", 2.5 * y.rangeBand())
        .attr("width", x(0.23) - x(0.20))
        .attr("height", 3.5 * y.rangeBand());

    var annotation = svg.append("text")
        .attr("class", "annotation")
        //.attr("x", x(0.10))
        .attr("y", 3.6 * y.rangeBand())
        .attr("text-anchor", "start")
        .text("Low earners with modest savings have less hardship than high earners with low savings")
        .call(wrap2, width / 4, x(0.102));

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


}