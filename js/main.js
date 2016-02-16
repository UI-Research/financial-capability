var MOBILE_THRESHOLD = 700;
var graphic2_data_url = "data/graphic2.csv";
var graphic3a_data_url = "data/graphic3a.csv";
var graphic3_data_url = "data/graphic3.csv";
var isMobile = false;
var $graphic = $('#graphic');
var COLORS = ["#1696d2", "#fdbf11"];
var COLORS3 = ["#a2d4ec", "#1696d2", "#0a4c6a"];
var numticks = 6;
var LABELS = ["Received public benefits", "Missed utility payment", "Missed housing payment"]

function drawGraphic2(container_width) {

    data.forEach(function (d) {
        d.shocks1 = +d.shocks1;
        d.shocks2 = +d.shocks2;
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

}

function drawGraphic3a(container_width) {

    data.forEach(function (d) {
        d.benefits = +d.benefits;
        d.housing = +d.housing;
        d.utility = +d.utility;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    var chart_aspect_height = 0.4;
    var margin = {
        top: 35,
        right: 80,
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

    var x1 = d3.scale.linear()
        .range([0, (width / 3) - 35])
        .domain([0, d3.max(data, function (d) {
            return d.benefits;
        })]);

    var x2 = d3.scale.linear()
        .range([width / 3, (width * (2 / 3)) - 35])
        .domain([0, d3.max(data, function (d) {
            return d.benefits;
        })]);

    var x3 = d3.scale.linear()
        .range([(width * (2 / 3)), width - 35])
        .domain([0, d3.max(data, function (d) {
            return d.benefits;
        })]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
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
            return i * width / 3;
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

    bars.append("rect")
        .attr("x", x1(0))
        .attr("width", function (d) {
            return x1(d.benefits);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("height", y.rangeBand())

    bars.append("rect")
        .attr("x", x2(0))
        .attr("width", function (d) {
            return Math.abs(x2(0) - (x2(d.utility)));
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("height", y.rangeBand())

    bars.append("rect")
        .attr("x", x3(0))
        .attr("width", function (d) {
            return Math.abs(x3(0) - (x3(d.housing)));
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("height", y.rangeBand())

    var barlabels = svg.selectAll(".point-label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "point-label");

    barlabels.append("text")
        .attr("x", function (d) {
            return x1(d.benefits) + 4;
        })
        .attr("y", function (d) {
            return y(d.assets) + y.rangeBand() / 2;
        })
        .text(function (d) {
            return d3.format("%")(d.benefits);
        });
    
    barlabels.append("text")
        .attr("x", function (d) {
            return x2(d.utility) + 4;
        })
        .attr("y", function (d) {
            return y(d.assets) + y.rangeBand() / 2;
        })
        .text(function (d) {
            return d3.format("%")(d.utility);
        });
    
    barlabels.append("text")
        .attr("x", function (d) {
            return x3(d.housing) + 4;
        })
        .attr("y", function (d) {
            return y(d.assets) + y.rangeBand() / 2;
        })
        .text(function (d) {
            return d3.format("%")(d.housing);
        });
}

function drawGraphic3(container_width) {

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

    lines.append("line")
        .attr("class", "chartline")
        .attr("y1", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("y2", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("x1", function (d) {
            return x(d.income1);
        })
        .attr("x2", function (d) {
            return x(d.income2);
        });

    lines.append("line")
        .attr("class", "chartline")
        .attr("y1", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("y2", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("x1", function (d) {
            return x(d.income2);
        })
        .attr("x2", function (d) {
            return x(d.income3);
        });

    var circles = svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("g")

    circles.append("circle")
        .attr("r", 5.5)
        .attr("cx", function (d) {
            return x(d.income1);
        })
        .attr("cy", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("fill", COLORS3[0])

    circles.append("circle")
        .attr("r", 5.5)
        .attr("cx", function (d) {
            return x(d.income2);
        })
        .attr("cy", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("fill", COLORS3[1])

    circles.append("circle")
        .attr("r", 5.5)
        .attr("cx", function (d) {
            return x(d.income3);
        })
        .attr("cy", function (d) {
            return y(d.assets) + y.rangeBand() / 3;
        })
        .attr("fill", COLORS3[2])

    var circlelabel = svg.selectAll(".point-label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "point-label")
        .filter(function (d) {
            return d.assets == "$0"
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
        .text("Lowest income third");

    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.income2);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("text-anchor", "middle")
        .text("Middle income third");

    circlelabel.append("text")
        .attr("x", function (d) {
            return x(d.income3);
        })
        .attr("y", function (d) {
            return y(d.assets);
        })
        .attr("text-anchor", "middle")
        .text("Top income third");

}