var MOBILE_THRESHOLD = 700;
var graphic2_data_url = "data/graphic2.csv";
var graphic3_data_url = "data/graphic3.csv";
var isMobile = false;
var $graphic = $('#graphic');
var COLORS = ["#1696d2", "#fdbf11"];
var COLORS3 = ["#a2d4ec", "#1696d2", "#0a4c6a"];
var numticks = 6;

function drawGraphic2(container_width) {

    data.forEach(function (d) {
        d.shocks1 = +d.shocks1;
        d.shocks2 = +d.shocks2;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    //vertical bar chart on mobile
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

function drawGraphic3(container_width) {

    data.forEach(function (d) {
        d.income1 = +d.income1;
        d.income2 = +d.income2;
        d.income3 = +d.income3;
    });

    if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }

    //vertical bar chart on mobile
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