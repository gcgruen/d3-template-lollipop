(function() {
    var margin = { top: 30, left: 150, right: 30, bottom: 20},
    height = 500 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  var svg = d3.select("#lollipop-chart")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // in this example, the scale is a linear one, but it could also use other scales
  // e.g. for time - just depending on what your datapoints represent
  var xPositionScale = d3.scaleLinear().range([0,width])
  // this only defines the range; the domain is defined upon reading in the data

  var y_variable_options = ['E','D','C','B','A']

  // the y scale is not a numerical one in this example, and draws from the above options for the y-variable
  var yPositionScale = d3.scalePoint().domain(y_variable_options).range([height,20])

  // if you have multiple datapoints for each of the y_variable_options, you can add color-coding for them here
  var colorScale = d3.scaleOrdinal().domain(["category_a", "category_b"]).range(['#00CD83','#E8D245'])

  // define how big your circles should be (it's the radius you are defining here)
  var circle_radius = 10

  d3.queue()
    .defer(d3.csv, "data-lollipop.csv", function(d){
      d.y_variable = d.y_variable
      d.color_category = d.color_category
      d.datapoint = +d.datapoint
      return d
    })
    .await(ready)

  function ready(error, datapoints) {

    // find the biggest x-value
    var datapoint_max =  d3.max(datapoints, function(d) { return d.datapoint });

    // define how much longer than the biggest value your x-scale should be:
    var plus_scale = 20

    // update the scale
    xPositionScale.domain([0, datapoint_max + plus_scale]);

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", circle_radius) 
      .attr("cx", function(d){
        return xPositionScale(d.datapoint)
      })
      .attr("cy", function(d){
        return yPositionScale(d.y_variable)
      })
      .attr("fill", function(d){
        return colorScale(d.color_category)
      })
      // here you can add the category (or another parameter) to the datapoint so you can inspect them via the JavaScript console, e.g. to double-check correct color coding
      .attr("class", function(d){
        return d.color_category
      })


    // Add your axes
    var xAxis = d3.axisTop(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0,0)")
      .style("font-family", "Noto Sans")
      .style("font-size", "20px")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(0,0)")
      .style("font-family", "Noto Sans")
      .style("font-size", "20px")
      .call(yAxis);

  
  }

})();
