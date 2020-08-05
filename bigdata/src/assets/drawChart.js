import * as d3 from "d3";

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

function setAxis(selection, graphHeight, xScale, yScale) {
  const xAxisGroup = selection.append("g")
    .attr("transform", `translate(0,${graphHeight})`);
  const yAxisGroup = selection.append("g");
  const xAxis = d3.axisBottom(xScale)
    .ticks(3)
    .tickFormat(d => d + " orders");
  const yAxis = d3.axisLeft(yScale);
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
  yAxisGroup.selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("fill", "orange")
    .style("font-weight", "bold")
    .style("font-size", "20px");
}

function drawPlot(selection, item, xScale, yScale) {
  const rects = selection
    .selectAll("rect")
    .data(item);
  rects
    .enter()
    .append("rect")      
    .attr("width", d=> xScale(d.orders))
    .attr("height", yScale.bandwidth)
    .attr("fill", "orange")
    .attr("x", 1)
    .attr("y", d => yScale(d.name))
    .on("mouseover", function(){
      d3.select(this)
        .transition()
        .duration(1200)
        .attr("width",xScale(1500))
    })
    .on("mouseout", function(d){
      d3.select(this)
        .transition()
        .duration(1200)
        .attr("width", xScale(d.orders))
    })
  rects.exit().remove();
}
function drawSlider(selection, xScale) {
  const slider = selection.append("g")
  .attr("class", "slider")
  // .attr("transform", `translate(${margin.left},${graphHeight/5})`);
  
  slider.append("line")
    .attr("x1", xScale.range()[0])
    .attr("x2", xScale.range()[1])
    .attr("class", "track")
  .select(function() {
    // 나의 부모 노드에 나의 클론(deep copy=true)를 자식 노드로 추가한다.
    return this.parentNode.appendChild(this.cloneNode(true)); 
  })
    .attr("class", "track-inset")
  .select(function() {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
    .attr("class", "track-overlay")
  .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function() {
        currentValue = d3.event.x;
        update(xScale.invert(currentValue)); 
      })
  );
}
export { drawSVG, setAxis, drawPlot, drawSlider }