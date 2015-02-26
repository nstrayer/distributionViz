// //make the distribution data
//http://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js

var logistic = function(x, theta) {
    var mu = 0;
    var y = (1 / (Math.sqrt(2 * Math.PI) * theta)) * (1 / x) * Math.exp(-Math.pow((Math.log(x) - mu), 2) / (2 * Math.pow(theta, 2)))
    return y;
}

var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

xs = _.range(0.01, 5, .01)

thetaMap = d3.scale.linear() //name the values from 0 to 20 and make their values from .1-.7
    .domain([0, 20])
    .range([0.1, 0.7])

var numOfLines = 30;

var yPos = d3.scale.linear() //scalling for creating horizontal lines
		.domain([0, numOfLines])
		.range([0, 5])


//default flat lines:
dataBegin = _.map(xs, function(num) {
    var returnObj = {}
    returnObj.x = num


    for (i in d3.range(numOfLines)) {
        returnObj[i] = yPos(i)
}
    return returnObj;
})



dataTest = _.map(xs, function(num) {
    var returnObj = {}
    returnObj.x = num

    for (i in d3.range(numOfLines)) { //do 20 different values of theta
        returnObj[i] = logistic(num, thetaMap(i)) //fill in the ith value with the log at mapped theta.
    }

    return returnObj;
})

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


x.domain(d3.extent(dataTest, function(d) {
    return d.x;
}));

y.domain([0,5]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)


for (i in d3.range(numOfLines)){

	var line = d3.svg.line()
	    .x(function(d) {
	        return x(d.x);
	    })
	    .y(function(d) {
	        return y(d[i]);
	    });

	svg.append("path")
	    .datum(dataTest)
	    .attr("class", "line")
	    .attr("d", line)
		.on("mouseover", function(d){
			d3.select(this).attr("fill", "red")
		});
}
