// //make the distribution data
//http://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js


var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var logistic = function(x, theta) {
    var mu = 0;
    var y = (1 / (Math.sqrt(2 * Math.PI) * theta)) * (1 / x) * Math.exp(-Math.pow((Math.log(x) - mu), 2) / (2 * Math.pow(theta, 2)))
    return y;
}

xs = _.range(0.01, 5, .01)

thetaMap = d3.scale.linear() //name the values from 0 to 20 and make their values from .1-.7
    .domain([0, 20])
    .range([0.1, 0.7])

var numOfLines = 20;

var yPos = d3.scale.linear() //scalling for creating horizontal lines
    .domain([0, numOfLines])
    .range([0, 5])


//default flat lines:
logistic = _.map(d3.range(numOfLines), function(i){
	toReturn = _.map(xs, function(num) {
        return {
            "x": num,
            "y": logistic(num, thetaMap(i))
        }
    })

    return toReturn;
})

horizontal = _.map(d3.range(numOfLines), function(i){
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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function change(newData){
	svg.selectAll(".line")
	    .data(newData)
	    .transition()
		.duration(2000)
		.delay(function(d,i){return 30*i})
	    .attr("class", "line")
	    .attr("d", line);
}


svg.selectAll(".line")
    .data(horizontal)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", line)
	.on("mouseover", function(){
		change(logistic)
	});
