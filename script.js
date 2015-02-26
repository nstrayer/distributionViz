//http://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js

var width = parseInt(d3.select("body").style("width").slice(0, -2)),
    //height  = parseInt(d3.select("body").style("height").slice(0,-2))
    //height = 800,
    height = $(window).height() - 20;
padding = 20;

var logistic = function(x, theta) {
    var mu = 0;
    var y = (1 / (Math.sqrt(2 * Math.PI) * theta)) * (1 / x) *
        Math.exp(-Math.pow((Math.log(x) - mu), 2) / (2 * Math.pow(theta, 2)))
    return y;
}

xs = _.range(0.01, 5, .07)

thetaMap = d3.scale.linear() //name the values from 0 to 20 and make their values from .1-.7
    .domain([0, 20])
    .range([0.1, 0.7])

var numOfLines = 20;

var yPos = d3.scale.linear() //scalling for creating horizontal lines
    .domain([0, numOfLines])
    .range([0, 5])


//default flat lines:
logistic = _.map(d3.range(numOfLines), function(i) {
    toReturn = _.map(xs, function(num) {
        return {
            "x": num,
            "y": logistic(num, thetaMap(i))
        }
    })

    return toReturn;
})

horizontal = _.map(d3.range(numOfLines), function(i) {
    toReturn = _.map(xs, function(num) {
        return {
            "x": num,
            "y": yPos(i)
        }
    })

    return toReturn;
})

var x = d3.scale.linear()
    .domain([0, 5])
    .range([0, width]);


var y = d3.scale.linear()
    .domain([0, 5])
    .range([height, 0]);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {
        return x(d.x);
    })
    .y(function(d) {
        return y(d.y);
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height + 2 * padding)
    .append("g")
    .attr("transform", "translate(" + padding + "," + 0 + ")");

var title = svg.append("text")
        .text("The Logistic Distribution")
        .attr("font-size", 45)
        .attr("font-family", "courier")
        .attr("text-anchor", "middle")
        .attr("fill-opacity", 0.0)
        .attr("x", x(3.3))
        .attr("y", y(3))

var intro = svg.append("text")
        .text("Click!")
        .attr("font-size", 45)
        .attr("font-family", "courier")
        .attr("text-anchor", "middle")
        .attr("x", x(2.5))
        .attr("y", y(2.51))

function change(newData) {
    svg.selectAll(".line")
        .data(newData)
        .transition()
        .duration(1500)
        .delay(function(d, i) {
            return 70 * i
        })
        .attr("class", "line")
        .attr("d", line);

    title
        .transition()
        .duration(2000)
        .attr("fill-opacity", 1)

    intro
        .transition()
        .duration(800)
        .attr("fill-opacity", 0)
        .remove()

}


svg.selectAll(".line")
    .data(horizontal)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", line)
    // .on("mouseover", function(d) {
    //     change(logistic)
    // });

d3.select("svg")
    .on("click", function() {
        change(logistic)
    })
