<template> 
  <div class="svg-test-wrap"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  mounted() {
    this.generateSVG()
  },
  methods: {
    generateSVG() {
      //2 different data arrays
      const dataArray1 = [30,35,45,55,70];
      const dataArray2 = [50,55,45,35,20,25,25,40];
      //globals
      let dataIndex=1;
      const xBuffer=50;
      const yBuffer=150;
      const lineLength=400;
      //create main svg element
      const svgDoc = d3.select(".svg-test-wrap").append("svg")
      svgDoc.attr("width", 500).attr("height", 300)
      svgDoc.append("text")
        .attr("x",xBuffer+(lineLength/2))
        .attr("y",50)
        .text("dataset");
      //create axis line
      svgDoc.append("line")
        .attr("x1",xBuffer)
        .attr("y1",yBuffer)
        .attr("x1",xBuffer+lineLength)
        .attr("y2",yBuffer)
      //create basic circles
      svgDoc.append("g").selectAll("circle")
        .data(eval("dataArray"+dataIndex))
        .enter()
        .append("circle")
        .attr("cx",function(d,i){
      var spacing = lineLength/(eval("dataArray"+dataIndex).length);
      return xBuffer+(i*spacing)
      })
      .attr("cy",yBuffer)
      .attr("r",function(d,i){return d});
      //button to swap over datasets
      d3.select(".wrap").append("button")
      .text("change data")
      .on("click",function(){
      //select new data
      if (dataIndex==1) {
      dataIndex=2;  
      } else   {
      dataIndex=1;
      }
      //rejoin data
      var circle = svgDoc.select("g").selectAll("circle")
      .data(eval("dataArray"+dataIndex));
      circle.exit().remove();//remove unneeded circles
      circle.enter().append("circle")
      .attr("r",0);//create any new circles needed
      //update all circles to new positions
      circle.transition()
      .duration(500)
      .attr("cx",function(d,i){
      var spacing = lineLength/(eval("dataArray"+dataIndex).length);
      return xBuffer+(i*spacing)
      })
      .attr("cy",yBuffer)
      .attr("r",function(d,i){return d});
      d3.select("text").text("dataset"+dataIndex);
      });//end click function

      console.log(d3.local());
    }
  }
}
</script>

<style scoped>
    svg {width:500px; height:500px}
    button  {float:left}
    line    {stroke:#ddd;shape-rendering: crispEdges;}
    text    {text-anchor:middle;}
    circle {fill:orange;stroke:orange;fill-opacity:0.5;}
    .axis line {fill:none;stroke:#ddd;shape-rendering: crispEdges;}
    .axis path  {fill:none;}
    .axis text {font-size:0.7em;fill:#555;font-family:sans-serif}
</style>