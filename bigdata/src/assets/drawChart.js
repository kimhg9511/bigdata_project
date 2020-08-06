import * as d3 from "d3";
import * as cloud from "d3-cloud";

function drawSVG(selection, width, height, margin) {
  const svg = selection.append("svg")
    .attr("class", "svg-wrap")
    .attr("width", width)
    .attr("height", height);
  const plot = svg.append("g")
    .attr("class", "plot")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  return plot;
}   
// function setAxis(selection, graphHeight, xScale, yScale) {
//   const xAxisGroup = selection.append("g")
//     .attr("transform", `translate(0,${graphHeight})`);
//   const yAxisGroup = selection.append("g");
//   const xAxis = d3.axisBottom(xScale)
//     .ticks(4)
//     .tickFormat(d => d + " 원");
//   const yAxis = d3.axisLeft(yScale);
//   xAxisGroup.call(xAxis);
//   yAxisGroup.call(yAxis);
//   yAxisGroup.selectAll("text")
//     .style("opacity", 0)
//   yAxisGroup.selectAll("text")
//     .transition()
//     .duration(1200)
//     .delay((d, i) => i * 20)
//     // .attr("transform", "rotate(-45)")
//     .attr("text-anchor", "end")
//     .attr("fill", "orange")
//     .style("font-weight", "bold")
//     .style("font-size", "8px")
//     .style("opacity", 1);
//   return { xAxisGroup, yAxisGroup };
// }
function drawBarPlot(selection, item, xValue, yValue, xScale, yScale) {
  console.log("draw");
  const rects = selection
    .selectAll("rect")
    .data(item);
  rects
    .append("rect")      
    .attr("class", "bar-rect")
    .attr("fill", "orange")
    .attr("x", 1)
    .attr("height", yScale.bandwidth)
    .on("mouseover", function(){
      d3.select(this)
        .transition()
        .duration(400)
        .attr("fill", "black")
        .attr("height", () => yScale.bandwidth() * 1.5)
    })
    .on("mouseout", function(d){
      d3.select(this)
        .transition()
        .duration(400)
        .attr("fill", "orange")
        .attr("height", yScale.bandwidth)
    })
    .on("update", function(){
      console.log(d3.event.detail);
    })
    .merge(rects)
    .transition()
    .duration(1200)
    .delay((d,i) => i * 20)
    .attr("width", d=> xScale(d[xValue]))
    .attr("y", d => yScale(d[yValue]))
  rects.exit().remove();
  return rects;
}
function drawSlider(selection, xScale) {
  const slider = selection.append("g")
  .attr("class", "slider")
  
  slider.append("line")
    .attr("x1", xScale.range()[0])
    .attr("x2", xScale.range()[1])
    .attr("class", "track")
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true)); 
    })
    .attr("class", "track-inset")
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
  return slider;
}

function drawCirclePlot(selection, data, xScale, height) {
  let locations = selection.selectAll(".location")
    .data(data);
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function(d) { return xScale(d.date); })
    .attr("cy", height/2)
    .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8); })
    .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7); })
    .style("opacity", 0.5)
    .attr("r", 8)
      .transition()
      .duration(400)
      .attr("r", 50)
      .transition()
      .attr("r", 8);
  locations.exit().remove();

  return locations;
}
function setWordCloud(keywords, spiral, fontSize, fontFamily, size, draw) {
  const wordCloud = cloud()
    .size(size)
    .words(Object.keys(keywords).map(function(d) { return {text: d}; }))
    .padding(2)
    .rotate(5)
    .text(d => d.text)
    .font(fontFamily)      
    .fontSize(d => fontSize(keywords[d.text]['count']))
    .spiral(spiral)
    .on("end", draw);
  return wordCloud;
}
function preProcess(data, date) {
  let temp_array = new Array();
  data.map( el =>{
    if(el['Date'] === date){
      temp_array.push(el)
    };
  });
  return temp_array
}
// https://www.d3-graph-gallery.com/graph/line_change_data.html
export { 
  drawSVG, 
  // setAxis, 
  drawBarPlot, 
  drawSlider, 
  // addProgressEvent,
  drawCirclePlot,
  setWordCloud,
  preProcess,
}