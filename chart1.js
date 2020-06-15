/* CODE SOURCES
https://observablehq.com/@bjnsn/zoomable-choropleth
https://www.d3-graph-gallery.com/graph/stackedarea_template.html
https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
https://github.com/johnwalley/d3-simple-slider
*/

// STATE LOOKUP DATA
stateLookup = {
    "VIC": {"count": 433, "emissionsIntensity": 902.19, "url": "https://gist.githubusercontent.com/FelixHarvey/3044b1e89dbc455d2b98bf72b1cbdd5d/raw/ed99e9c2964f7f08a05f50352a646ca88acbbaab/Victoria%2520Updated.csv"},
    "NSW": {"count": 538, "emissionsIntensity": 682.72, "url": "https://gist.githubusercontent.com/FelixHarvey/3044b1e89dbc455d2b98bf72b1cbdd5d/raw/b17865e279e2a2d770f4cdbbbd226e233729a299/NSW.csv"},
    "SA": {"count": 170, "emissionsIntensity": 233.05, "url": "https://gist.githubusercontent.com/FelixHarvey/3044b1e89dbc455d2b98bf72b1cbdd5d/raw/ed99e9c2964f7f08a05f50352a646ca88acbbaab/SA.csv"},
    "WA": {"count": 260, "emissionsIntensity": 0, "url": ""},
    "TAS": {"count": 98, "emissionsIntensity": 6.63, "url": "https://gist.githubusercontent.com/FelixHarvey/3044b1e89dbc455d2b98bf72b1cbdd5d/raw/f05fdd3a9dcd16ceb1ee623830c959b0de3c1b48/TAS.csv"},
    "QLD": {"count": 526, "emissionsIntensity": 795.09, "url": "https://gist.githubusercontent.com/FelixHarvey/3044b1e89dbc455d2b98bf72b1cbdd5d/raw/ed99e9c2964f7f08a05f50352a646ca88acbbaab/QLD.csv"},
};

// SELECT APPROPRIATE CHART
var map = d3.select("body")
            .select("#chart");

// DIMENSIONS
var width = map.node().getBoundingClientRect().width;
var height = width*1/2; // Used to be *2/3

// PROJECTION & PATH
var projection = d3.geoMercator()
                    .center([ 150.5, -32.0 ])
                    .scale(530);

var path = d3.geoPath()
             .projection(projection);

// CREATE PATH          
var svg = map.append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", "0 0 600 400")
                .attr("preserveAspectRatio", "xMidYMid meet");
  
var g = svg.append("g");

// TOOLTIP DIV
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// CHOROPLETH LINEAR SCALE 
const linScale = d3.scaleLinear();

linScale.domain([2000, 9000]); // Unfortunately manual due to extreme outlier

const colorScaleLin = d3.scaleSequential(
    (d) => d3.interpolateOrRd(linScale(d))
    );

// CHOROPLETH LEGEND    
svg.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(-80,40)");

var legendLinear = d3.legendColor()
                        .ascending(true)
                        .labelFormat(d3.format(",.0f"))
                        .shapeHeight(10)
                        .shapeWidth(25)
                        .shapePadding(-4)
                        .cells([2000,4000,6000, 8000, 10000])
                        .orient('vertical')
                        .title("Household Yearly Electricity Usage (kWh)")
                        .scale(colorScaleLin);

svg.select(".legendLinear")
    .call(legendLinear);

// DYNAMIC MAP WITH ZOOM   
d3.select(window).on("resize", sizeChange);

zoom = d3.zoom()
            .scaleExtent([0.9, 200])
            .on('zoom', () => g.attr("transform", d3.event.transform));

svg.call(zoom);

// READ IN USAGE DATA
d3.csv("electricity-usage.csv").then(function(data) {
    // Log the data to see it works
    //console.table(data);

    // Import the TopoJSON data
    importTopoJSON(data);
});

// TOPO JSON DATA
function importTopoJSON(data) {

    // Read in the TopoJSON file
    d3.json("data2.json").then(function(json) {
        // This code is used to manually merge attributes from csv with JSON
        // Then copied into file for later use
        
        var geometries = json.objects.SA2_2011_SMALLER.geometries;
        /*
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < geometries.length; j++) {
                if (data[i].SA2NAME == geometries[j].properties.SA2_NAME11) {
                    geometries[j].properties.medianElectricityUsage = data[i].Median;
                    geometries[j].properties.AusRanking = data[i].AusRanking;
                    geometries[j].properties.StateRanking = data[i].StateRanking;
                    geometries[j].properties.State = data[i].STATE;
                    geometries[j].properties.medianEmissions = Math.round(data[i].Median * stateLookup[data[i].STATE]["emissionsIntensity"]/1000);
                }
            }
        } 
        document.write(JSON.stringify(json)); */


        // SA2 REGION PATHS
        g.selectAll("path")
            .data(topojson.feature(json, json.objects.SA2_2011_SMALLER).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "0.1")
            .attr("vector-effect", "non-scaling-stroke")

            // ADD COLOR BASED ON ELECTRICITY USAGE
            .style("fill", function(d) {
                var value = d.properties.medianElectricityUsage;
                if (value) {
                    //If value exists use color
                    return colorScaleLin(value);
                } else {
                    //If value is undefined use grey
                    return "#ccc";
                }
            })

            // DISPLAY TOOLTIP
            .on("mouseover", function(d) {	
                // If data exists add otherwise add no data
                if (d.properties.State && d.properties.medianElectricityUsage) {
                    var text =  "<p><strong>" + d.properties.SA2_NAME11  + "</strong>";
                    if (!document.getElementById("emissions").checked){
                        text +="<br>Median Electricity: " + Math.round(d.properties.medianElectricityUsage).toLocaleString() + " kWh<br>" 
                        + "AUS Rank: " + Math.round(d.properties.AusRanking).toLocaleString() + " out of 1959<br>"
                        + d.properties.State + " Rank: " + Math.round(d.properties.StateRanking).toLocaleString() +  " out of " + Math.round(stateLookup[d.properties.State]["count"]).toLocaleString(); 
                    }
                    else if (d.properties.State != "WA"){
                        text += "<br>" +"Median Emissions: " + d.properties.medianEmissions.toLocaleString() + " kg CO₂e";

                    }
                    else {
                        text += "<br> No data available"
                    }
                    text += "</p>";

                }        
                else {
                    var text = "<p><strong>" + d.properties.SA2_NAME11  + "</strong><br>No data available"
                }
                // TOOLTIP TRANSITION
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);	
                div.html(text)	
                    .style("left", (d3.event.pageX + 10) + "px")		
                    .style("top", (d3.event.pageY - 70) + "px");
                    
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.7');})

            // REMOVE TOOLTIP ON MOUSEOUT
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');		
            })
            
            // ONCLICK OF REGION, CHANGE AREA CHART (CHART2)
            .on("click",function(d) {
            updateAreaChart(d.properties.State);
            });
    }, function(error) {
        console.log(error);
    });

}

// ZOOM FUNCTION
function sizeChange() {
    var width = map.node().getBoundingClientRect().width;
    var height = width*1/2;
    svg.attr("width", width)
        .attr("height", height);
}

// PERCENTILES SLIDER
var data = [0, 0.2, 0.4, 0.6, 0.8, 1];
rect = d3.select("#controls")
sliderRange = d3.sliderBottom()
                .min(d3.min(data))
                .max(d3.max(data))
                .width(rect.node().getBoundingClientRect().width-100)
                .tickFormat(d3.format('.2%'))
                .ticks(5)
                .default([0.0, 1.0])
                .fill('#2196f3')
                .on('onchange', val => {
                d3.select('p#value-range').text(val.map(d3.format('.2%')).join('-'));
                });
                sliderRange.on("end", val => {
                    updateMap(val[0], val[1])});

var gRange = d3.select('div#slider-range')
                .append('svg')
                .attr('width', rect.node().getBoundingClientRect().width)
                .attr('height', 100)
                .append('g')
                .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
    sliderRange
      .value()
      .map(d3.format('.2%'))
      .join('-')
  );

// UPDATE CHOROPLETH BASED ON SELECTED PERCENTILES
var updateMap = function(min, max) {
    if (!document.getElementById("emissions").checked) {
        g.selectAll("path")
            .join()
            .transition(transitionType).duration(200)
            .style("fill", function(d) {

                // Add color
                var value = d.properties.medianElectricityUsage;
                var percentile = +d.properties.AusRanking/1959;
                if (value && percentile>=min && percentile<=max) {
                    //If value exists use color
                    return colorScaleLin(value);
                } else {
                    //If value is undefined use grey
                    return "#ccc";
                }
            })
    }
}

// CHANGE CHOROPLETH DATA TO EMISSIONS
function changeToEmissions() {
    d3.json("data2.json").then(function(json) {

        // ADD LEGEND
        linScale.domain([0,7000])
        const colorScaleLin = d3.scaleSequential(
            (d) => d3.interpolateOrRd(linScale(d))
        )

        svg = d3.select("body")
                .select("#chart").select("svg");

        svg.select(".legendLinear").remove();

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(-80,40)");

        var legendLinear = d3.legendColor()
                                .ascending(true)
                                .labelFormat(d3.format(",.0f"))
                                .shapeHeight(10)
                                .shapeWidth(25)
                                .shapePadding(0)
                                .cells([0,1500,3000,4500, 6000, 7500])
                                .orient('vertical')
                                .title("Yearly Emissions from Electricity (kg CO₂e)")
                                .scale(colorScaleLin);

        svg.select(".legendLinear")
            .call(legendLinear);
        
        // ADD NEW EMISSIONS DATA
        g.selectAll("path")
            .data(topojson.feature(json, json.objects.SA2_2011_SMALLER).features)
            .transition()
            .duration(500)
            .style("fill", function(d) {

                // Add color
                var value = Number(d.properties.medianEmissions);
                if (value) {
                    //If value exists use color
                    return colorScaleLin(value);
                } else {
                    //If value is undefined use grey
                    return "#ccc";
                }
            })
    })
}

// CHANGE BACK TO ELECTRICITY USAGE
function changeToElectricity() {
    d3.json("data2.json").then(function(json) {

        // ADD LEGEND
        linScale.domain([2000,10000])
        const colorScaleLin = d3.scaleSequential(
            (d) => d3.interpolateOrRd(linScale(d))
        )

        svg = d3.select("body")
                .select("#chart").select("svg");

        svg.select(".legendLinear").remove();

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(-80,40)");
            var legendLinear = d3.legendColor()
                .ascending(true)
                .labelFormat(d3.format(",.0f"))
                .shapeHeight(10)
                .shapeWidth(25)
                .shapePadding(0)
                .cells([2000,4000,6000, 8000, 10000])
                .orient('vertical')
                .title("Household Yearly Electricity Usage (kWH)")
                .scale(colorScaleLin);

        svg.select(".legendLinear")
            .call(legendLinear);

        // ADD ELECTRICITY DATA BACK
        g.selectAll("path")
            .data(topojson.feature(json, json.objects.SA2_2011_SMALLER).features)
            .transition()
            .duration(500)
            .style("fill", function(d) {

                // Add color
                var value = Number(d.properties.medianElectricityUsage);
                if (value) {
                    //If value exists use color
                    return colorScaleLin(value);
                } else {
                    //If value is undefined use grey
                    return "#ccc";
                }
            })
    })
}

// ASSIGN BUTTON CLICKS TO RELEVANT FUNCTIONS
document.getElementById("emissions").onclick = changeToEmissions;
document.getElementById("electricity").onclick = changeToElectricity;