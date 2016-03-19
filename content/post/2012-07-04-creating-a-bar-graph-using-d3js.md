---
date: 2012-07-04T00:00:00Z
tags:
- javascript
- d3
title: Creating a bar graph using D3.js
url: /2012/07/04/creating-a-bar-graph-using-d3js/
---

I had to create a bar graph for a page showing some stats.  
So, I started searching for available options.  

I tried several options such as Highcharts, Google Graph API, Raphael, etc.  
Highcharts is great, but it a bit too much for a small internal project. Google Graph API, I thought it was kinda dull. Raphael, I felt it was a bit difficult to work with. Then D3.js, after doing some experiments, I found it easy to use. And SVG graph looks quite good.  

[D3.js](http://d3js.org)

Here is a nice example showing how to create a bar graph from the official site..  
[A Bar Chart, Part 1](http://mbostock.github.com/d3/tutorial/bar-1.html)

This tutorial is fine but it's a bit too minimum.  
It doesn't provide how to add labels to each bar.  
So, in this article, I will add labels to each bar.  

## Data

First, here is some fake data to work on: John, Tim, Sam, Greg, and Charles had a competition on how many hotdogs they can eat.  

    John:  8
    Tim:   4
    Sam:   9
    Greg: 12
    Charles: 11

Sure, Greg is the winner, and let's visualize it with bar graph.

## Step 1: Blank sheet

Let's start with a blank canvas, but not the canvas in HTML5 sense, just an area in SVG where we draw the chart.  

<div class="barchart" id="step-1">
</div>

1. Select the element
2. Append an SVG element
3. Set class to 'chart'
4. Set width to 400px and height to bar's height times the number of data

<!-- dummy -->

    var names = ['John', 'Tim', 'Sam', 'Greg', 'Charles'],
        hotdogs = [8, 4, 9, 12, 11],
        chart,
        width = 400,
        bar_height = 20,
        height = bar_height * names.length;

    chart = d3.select($("#step-1")[0]) 
      .append('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height);

### Stylesheet

As a starter, we need a background color and a little bit of margin.

    .chart {
      background: #b0e0f8;
      margin: 5px;
    }

## Step 2: Bars

Now, it's time to add some bars.  

<div class="barchart" id="step-2">
</div>

1. Add scaling function for x.  
It uses [linear](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear), [domain](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_domain), and [range](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_range) functions.
2. Add positioning function for y.  
It uses [ordinal](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal), [domain](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_domain), and [rangeBands](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands) functions
3. Select all "rect", but since there is none, it returns an empty selection
4. Set data
5. Enter each node and append an SVG rect
6. We don't actually need to set position in x since we want it to be 0. So attr("x", 0) can be removed. But, let's leave it here for clarification.
6. Set y position using the function y which basically returns 0,20,40,...
7. Set width of each bar using the function x which takes each value from hotdogs and calculate its appropriate width.
8. Set height for each bar with y.rangeBand which returns 20

<!-- dummy -->

    var x, y;
    x = d3.scale.linear()
       .domain([0, d3.max(hotdogs)])
       .range([0, width]);

    y = d3.scale.ordinal()
       .domain(d3.range(hotdogs.length))
       .rangeBands([0, height]);

    chart.selectAll("rect")
       .data(hotdogs)
       .enter().append("rect")
       .attr("x", 0)
       .attr("y", y)
       .attr("width", x)
       .attr("height", y.rangeBand());

### Stylesheet

Adding a thin white line around each bar and set the filling to steelblue.

    .chart rect {
      stroke: white;
      fill: steelblue;
    }

## Step 3: Add values

Let's show the value for each bar so that we know exactly how much they eat.  
We want the value printed on each bar on far right.  

<div class="barchart" id="step-3">
</div>

1. Select all "text", but again there is no "text" elements. We will get an emplety selection.
2. Set data
3. Enter each node and append an SVG text
4. Set position of the text to be the width of bar by using the function x
5. Set y position using the function y and adding the half of each bar height. This sets the position of y to be the middle of bar height.
6. Move the text a little to the left by setting dx to -5px
7. Set dy to .36em. Why? Here is why:  
I use bootstrap for the whole styling.  
It sets font-size to 13px and line-height to 18px.  
13 divided by 18 is about .72, and y is now at the middle of the bar height.  
We want the text to be exactly positioned vertically in the middle within each bar.  
So, we have to push down by half of the font height.  
That is .72 divided by 2 which is .36. Therefore, we need .36em here.
8. Right-justfied the text by setting "text-anchor" to "end"
9. Set the value as String

Add the following code after the Step 2.  

    chart.selectAll("text")
      .data(hotdogs)
      .enter().append("text")
      .attr("x", x)
      .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
      .attr("dx", -5)
      .attr("dy", ".36em")
      .attr("text-anchor", "end")
      .text(String);

### Stylesheet

Just set the color of text for the values.

    .chart text {
      fill: white;
    }

## Step 4: Add names

Before adding names, we need some space on the left of chart.  
Then, add all the names.  
Names are centered on the name column.  

<div class="barchart" id="step-4">
</div>

1. Define left_width to 100px. This becomes the offset for the whole chart.
2. Draw bars. This is same as before.
3. Draw values. This is a bit different.  
This time, we select text element with 'score' class. We need this because we will add more text elements later, and this will prevent name collisions to happen.  
We add class 'score' by using attr('class', 'score').  
Position of x moves to the right by left_width too.
4. Draw names.
  1. Select text elements with 'name' class.
  2. Set data to be 'names' array.
  3. Set x to be the center of left_width by dividing by 2
  4. Set y and dy as we did for the values too in Step 3
  5. Set the text to center by using 'text-anchor' with 'middle'
  6. Add class 'name'
  7. Set the value as String

<!-- dummy -->

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
      .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
      .attr("dy", ".36em")
      .attr("text-anchor", "middle")
      .attr('class', 'name')
      .text(String);

### Stylesheet

Setting the name to black.

    .chart text.name {
      fill: #000;
    }

## Step 5: Add margins and etc

I will wrap it up with adding few extra things:
- Bars are bit too tight, so add gaps in between
- Add paddings so that it doesn't look squashed
- Add rules for the chart
- Add a bit of css hovering effect

<div class="barchart" id="step-5">
</div>

### Define gaps
- Define the gap between each bar to be 2px top and bottom.  
- Redefine the function y to adjust the gap.  
The height of each bar area is bar_height + 2 times 'gap'.  

<!-- dummy -->

    var gap = 2;
    y = d3.scale.ordinal()
      .domain(hotdogs)
      .rangeBands([0, (bar_height + 2 * gap) * names.length]);

### Add paddings
- Set width to be 40px wider
- Set height to be 30px taller
- Append Graphics context 'g' and transform the origin of cooridate to be 10,20. Then, we don't have to worry about adjusting the position for each element that we have been doing so far.

<!-- dummy -->

    chart = d3.select($("#step-5")[0])
      .append('svg')
      .attr('class', 'chart')
      .attr('width', left_width + width + 40)
      .attr('height', (bar_height + gap * 2) * names.length + 30)
      .append("g")
      .attr("transform", "translate(10, 20)");

### Draw ticks
- d3.max returns the maximum value given an array of elements.
- [ticks](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_ticks) function returns "approximately count representative values from the scale's input domain." In this case, it returns 0,1,2,...12. These numbers work as tick marks.
- Draw a vertical line from (x1, y1) to (x2, y2).

<!-- dummy -->

    chart.selectAll("line")
      .data(x.ticks(d3.max(hotdogs)))
      .enter().append("line")
      .attr("x1", function(d) { return x(d) + left_width; })
      .attr("x2", function(d) { return x(d) + left_width; })
      .attr("y1", 0)
      .attr("y2", (bar_height + gap * 2) * names.length);

### Add rules
This is just like other text elements.
Only difference is that we write the numbers 1, 2, 3, ... horizontally.

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

### Add bars
- Set y position to be the value returned from the y function plus one gap.
- Set height to be bar_height, not y.rangeBand().

<!-- dummy -->

    chart.selectAll("rect")
      .data(hotdogs)
      .enter().append("rect")
      .attr("x", left_width)
      .attr("y", function(d) { return y(d) + gap; })
      .attr("width", x)
      .attr("height", bar_height);

### Add values and names
Same as before.

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
      .attr("y", function(d, i){ return y(d) + y.rangeBand()/2; } )
      .attr("dy", ".36em")
      .attr("text-anchor", "middle")
      .attr('class', 'name')
      .text(String);

### Stylesheet
The rest of the setting that we need.

    .chart line {
      stroke: #c1c1c1;
    }

    .chart .rule {
      fill: #000;
    }

    /* removed the while stroke as we don't need it anymore */
    #step-5 .chart rect {
      stroke: none;
    }

    /* a bit of hovering effect for each bar */
    #step-5 .chart rect:hover {
      fill: #64707D;
    }

## Gist
Here is the code at gist: <https://gist.github.com/3046929>

<script src="/assets/javascripts/jquery-1.7.1.min.js" type="text/javascript"> </script>
<script src="/assets/javascripts/d3.v2.min.js" type="text/javascript"> </script>  
<script src="/assets/javascripts/d3js-bargraph.js" type="text/javascript"> </script>  
<script src="/assets/javascripts/rloader1.5.3_min.js" type="text/javascript"> </script>  
<script type="text/javascript">  
  $.rloader([ {src:'/assets/stylesheets/d3js-bargraph.css'} ]);  
</script>  


