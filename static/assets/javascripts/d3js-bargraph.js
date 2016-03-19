jQuery(function($) {
  var names = ['John', 'Tim', 'Sam', 'Greg', 'Charles'],
      hotdogs = [8, 4, 9, 12, 11],
      chart,
      width = 400,
      bar_height = 20,
      height = bar_height * names.length;

  /* step 1 */
  chart = d3.select($("#step-1")[0])
    .append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height);

  /* step 2 */
  var x, y;

  chart = d3.select($("#step-2")[0])
    .append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height);

  x = d3.scale.linear()
     .domain([0, d3.max(hotdogs)])
     .range([0, width]);

  y = d3.scale.ordinal()
    .domain(hotdogs)
    .rangeBands([0, height]);

  chart.selectAll("rect")
     .data(hotdogs)
     .enter().append("rect")
     .attr("x", 0)
     .attr("y", y)
     .attr("width", x)
     .attr("height", y.rangeBand());

  /* step 3 */
  chart = d3.select($("#step-3")[0])
    .append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height);

  chart.selectAll("rect")
    .data(hotdogs)
    .enter().append("rect")
    .attr("x", 0)
    .attr("y", y)
    .attr("width", x)
    .attr("height", y.rangeBand());

  chart.selectAll("text")
    .data(hotdogs)
    .enter().append("text")
    .attr("x", x)
    .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
    .attr("dx", -5)
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .text(String);

  /* step 4 */
  var left_width = 100;

  chart = d3.select($("#step-4")[0])
    .append('svg')
    .attr('class', 'chart')
    .attr('width', left_width + width)
    .attr('height', height);

  chart.selectAll("rect")
    .data(hotdogs)
    .enter().append("rect")
    .attr("x", left_width)
    .attr("y", y)
    .attr("width", x)
    .attr("height", y.rangeBand());

  chart.selectAll("text.score")
    .data(hotdogs)
    .enter().append("text")
    .attr("x", function(d) { return x(d) + left_width; })
    .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
    .attr("dx", -5)
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr('class', 'score')
    .text(String);

  chart.selectAll("text.name")
    .data(names)
    .enter().append("text")
    .attr("x", left_width / 2)
    .attr("y", function(d, i){ return y(hotdogs[i]) + y.rangeBand()/2; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "middle")
    .attr('class', 'name')
    .text(String);

  /* step 5 */
  var gap = 2;
  // redefine y for adjusting the gap
  y = d3.scale.ordinal()
    .domain(hotdogs)
    .rangeBands([0, (bar_height + 2 * gap) * names.length]);


  chart = d3.select($("#step-5")[0])
    .append('svg')
    .attr('class', 'chart')
    .attr('width', left_width + width + 40)
    .attr('height', (bar_height + gap * 2) * names.length + 30)
    .append("g")
    .attr("transform", "translate(10, 20)");

  chart.selectAll("line")
    .data(x.ticks(d3.max(hotdogs)))
    .enter().append("line")
    .attr("x1", function(d) { return x(d) + left_width; })
    .attr("x2", function(d) { return x(d) + left_width; })
    .attr("y1", 0)
    .attr("y2", (bar_height + gap * 2) * names.length);

  chart.selectAll(".rule")
    .data(x.ticks(d3.max(hotdogs)))
    .enter().append("text")
    .attr("class", "rule")
    .attr("x", function(d) { return x(d) + left_width; })
    .attr("y", 0)
    .attr("dy", -6)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .text(String);

  chart.selectAll("rect")
    .data(hotdogs)
    .enter().append("rect")
    .attr("x", left_width)
    .attr("y", function(d) { return y(d) + gap; })
    .attr("width", x)
    .attr("height", bar_height);

  chart.selectAll("text.score")
    .data(hotdogs)
    .enter().append("text")
    .attr("x", function(d) { return x(d) + left_width; })
    .attr("y", function(d, i){ return y(d) + y.rangeBand()/2; } )
    .attr("dx", -5)
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr('class', 'score')
    .text(String);

  chart.selectAll("text.name")
    .data(names)
    .enter().append("text")
    .attr("x", left_width / 2)
    .attr("y", function(d, i){ return y(hotdogs[i]) + y.rangeBand()/2; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "middle")
    .attr('class', 'name')
    .text(String);

}(jQuery));


