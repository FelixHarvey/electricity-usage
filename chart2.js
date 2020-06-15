// SECOND CHART DETAILS
margin = {top: 60, right: 300, bottom: 50, left: 50},
    //width = 950 - margin.left - margin.right,
    width = map.node().getBoundingClientRect().width - margin.right - margin.left,
    height = 200 - margin.top - margin.bottom;

// CONSISTENT TRANSITION TYPE 
transitionType = d3.easeCubicOut

// ADD SVG
svg = d3.select("#chart2")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("class", "main")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

// ADD SEPARATOR LINE
d3.select("#chart2").select("svg")
                    .append("rect")
                    .attr("width", d3.select("#chart2").node().getBoundingClientRect().width)
                    .attr("height", 1);

// PARSE DATE FORMAT                             
parseDate = d3.timeParse("%Y/%m/%d");

// LINE FOR HOVERING OVER CHART
svg.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

// PARSE DATA
globalData = []

areaChart = function(url) { 
    d3.csv(url).then(function(data) {
        globalData = data;
        
        // PARSE DATE
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

        // List of groups = header of the csv files
        keys = data.columns.slice(1,-1)
          
        // COLOR LOOKUP
        color = function(d){
              lookup = { "Solar (Rooftop)": "rgb(248, 231, 28)",
              "Solar (Utility)": "rgb(223, 207, 0)",
              "Wind": "rgb(65, 117, 5)",
              "Hydro": "rgb(69, 130, 180)",
              "Battery (Discharging)": "rgb(0, 162, 250)",
              "Gas (Reciprocating)": "rgb(249, 220, 188)",
              "Gas (OCGT)": "rgb(255, 205, 150)",
              "Gas (CCGT)": "rgb(253, 180, 98)",
              "Gas (Steam)": "rgb(244, 142, 27)",
              "Distillate": "rgb(243, 80, 32)",
              "Biomass": "rgb(163, 136, 111)",
              "Black Coal": "rgb(18, 18, 18)",
              "Brown Coal": "rgb(139, 87, 42)"}
              return lookup[d];
          }

        // STACK DATA
        stackedData = d3.stack()
          .keys(keys)
          (data)

        // AXES 
        // X-AXIS 
        x = d3.scaleTime()
              .domain([new Date("2005"),d3.max(data, function(d) { return new Date(d.date); })])
              .range([ 0, width ]);

        svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).ticks(10))

        svg.append("text")
            .text("Time (year)")
            .attr("x", width)
            .attr("y", height+40);

        // Y-AXIS
        yAxisLabel = svg.append("text")
                        .text("VIC GWh of Electricity (Generation)")
                        .attr("x", 0)
                        .attr("y", -20);
            
        y = d3.scaleLinear()
              .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
              .range([ height, 0 ]);

        yAxis = svg.append("g")
                    .call(d3.axisLeft(y).ticks(5))

        areaChart = svg.append('g')
          .attr("clip-path", "url(#clip)");

        // GENERATE AREA
        area = d3.area()
          .x(function(d) { return x(d.data.date); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); })

        // SHOW AREA
        areaChart.selectAll("layers")
                  .data(stackedData)
                  .enter()
                  .append("path")
                    .attr("class", function(d) { return "area " + d.key.replace(/[^\w]/g, "") })
                    .style("fill", function(d) { return color(d.key); })
                    .attr("d", area);

        // AREA CHART TOOLTIP  
        areaChart.on("mousemove", drawTooltip)
                .on("mouseout", removeTooltip);
                
        tooltipLine = svg.append('line');
        tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
        function removeTooltip() {
            if (tooltip) tooltip.style('display', 'none');
            if (tooltipLine) tooltipLine.style('display', 'none');
        }

      // LEGEND HIGHLIGHT  
      highlight = function(d){
        // reduce opacity of all groups
        d3.selectAll(".area").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d.replace(/[^\w]/g, "")).style("opacity", 1)
      }
      
      noHighlight = function(d){
        d3.selectAll(".area").style("opacity", 1)
      }

      // LEGEND
      size = 15
        legend = svg.append("g")
      .attr("class", "legend");

      // LEGEND RECT
      legend.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", function(d,i) {return ~~(i/5)*160 + width+15})
          .attr("y", function(d,i){ return -10 + (i%5)*(size+5)})
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return color(d)})
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

      // LEGEND TEXT    
      legend.selectAll("text")
        .data(keys)
        .enter()
        .append("text")
          .attr("class", "mylabels")
          .attr("x", function(d,i) {return ~~(i/5)*160 + width+35})
          .attr("y", function(d,i){ return -10 + (i%5)*(size+5) + (size/2)})
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .attr("font-size", "15px")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

})}

// UPDATE AREA CHART BASED ON STATE
function updateAreaChart(state) {
    url = stateLookup[state]["url"];
    stackedData = [];
    d3.csv(url).then(function(data) {
        globalData = data;
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

      // COLUMNS
       keys = data.columns.slice(1,-1)
    
      // STACKED DATA
      stackedData = d3.stack().keys(keys)(data)

      // UPDATE AXES
      y.domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      yAxis.transition().duration(750).ease(transitionType).call(d3.axisLeft(y).ticks(5));
      yAxisLabel.text(state + " GWh of Electricity (Generation)")

      // GENERATE AREA
       area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    
      // SHOW AREA
      areaChart
        .selectAll("path")
        .data(stackedData)
        .join("path")
        .transition()
          .attr("class", function(d) { return "area " + d.key.replace(/[^\w]/g, "") })
          .style("fill", function(d) { return color(d.key); })
          .attr("d", area).duration(750)
          .ease(transitionType);

        areaChart.on("mouseover", drawTooltip);

        // LEGEND AS ABOVE
        legend.selectAll("rect")
        .data(keys)
        .join("rect")
        .transition()
        .attr("x", function(d,i) {return ~~(i/5)*160 + width+15})
        .attr("y", function(d,i){ return -10 + (i%5)*(size+5)})
          .attr("height", size)
          .attr("width", size)
          .style("fill", function(d){ return color(d)})
          .duration(750).ease(transitionType);
        
        legend.selectAll("text")
        .data(keys)
        .join("text")
        .transition()
          .attr("class", "mylabels")
          .attr("x", function(d,i) {return ~~(i/5)*160 + width+35})
          .attr("y", function(d,i){ return -10 + (i%5)*(size+5) + (size/2)})
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .attr("font-size", "15px")
          .style("alignment-baseline", "middle")
          .duration(750).ease(transitionType);

        legend.selectAll("rect")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight);

        legend.selectAll(".mylabels")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight);
    })
}

// DRAW TOOLTIP
function drawTooltip() {
    xDate = x.invert(d3.mouse(this)[0]);
    tooltip.transition()
    .style('display', 'block')
    .duration(200)
    .style("opacity", .9)

    xDate.setDate(1)
    xDate.setHours(0);
    xDate.setMinutes(0);
    xDate.setSeconds(0);
    xDate.setMilliseconds(0);
    values = globalData.find(function(row) {
        return row.date.getTime() === xDate.getTime();
    })

    text = "<p><strong>" + xDate.toLocaleString('default', { month: 'short' , year: 'numeric'}) + "</strong>";
    Object.keys(values).slice(1,-2).forEach(function(k){
        text += ("<br>" + k + ' : ' + Math.round(values[k]*100/values.Total) + "%");
    });

    tooltip.html(text)
    .style("left", (d3.event.pageX ) + 20 + "px")
    .style("top", (d3.event.pageY ) - 100 + "px");

    tooltipLine.attr('stroke', 'black')
    .attr('x1', x(xDate))
    .attr('x2', x(xDate))
    .attr('y1', 0)
    .attr('y2', height)
    .style('display', 'block');
  }
areaChart(stateLookup["VIC"]["url"]);

// ASSIGN BUTTON ONCLICK EVENTS TO UPDATEAREACHART FUNCTION
document.getElementById("VIC").addEventListener("click", function() { updateAreaChart("VIC")});
document.getElementById("NSW").addEventListener("click", function() { updateAreaChart("NSW")});
document.getElementById("QLD").addEventListener("click", function() { updateAreaChart("QLD")});
document.getElementById("TAS").addEventListener("click", function() { updateAreaChart("TAS")});
document.getElementById("SA").addEventListener("click", function() { updateAreaChart("SA")});