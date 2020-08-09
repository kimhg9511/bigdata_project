<template>
  <div id="bar-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      data: [
        3,
        -2,
        -1,
        6,
        -16,
        4,
        9,
        -4.5
      ]
    }
  },
  mounted() {
    this.drawBarChart()
  },
  methods: {
    drawBarChart() {
      const chart = {
        width: 500,
        height: 500,
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        graphWidth() {
          return this.width - this.margin.left - this.margin.right;
        },
        graphHeight() { 
          return this.height - this.margin.top - this.margin.bottom;
        },
      };
      // svg(wrap)
      let data = this.data.sort((a,b)=> b-a)
      const svgBar = d3.select("#bar-chart-profit")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
        .classed("svg-content", true)
      // g(real chart)
      const barChart = svgBar.append("g")
        .attr("transform", `translate(${chart.margin.top},${chart.margin.left})`);
      barChart.selectAll("rect").data(data).call(draw, barChart, data)

      // rect(bar)  
      function draw(selection, plot, data) {
        const dataMax = Math.max.apply(null, data);
        // init
        selection.enter()
          .append("rect")
          .on("click", () => {
            data.reverse();
            plot.selectAll("rect").data(data).call(draw, plot, data)
          })
          .attr("fill", d => {  
            return d >= 0
              ? "pink"
              : "skyblue"
          })
          .attr("x", d => {
            return d >= 0 
              ? chart.graphWidth() / 2 
              : chart.graphWidth() / 2 - (-d) * 10
          })
          .attr("y", (d, i) => {            
            return i * 20
          })
          .attr("width", d => d >= 0 ? d*10 : -d*10)
          .attr("height", 20);
        // on change
        selection.data(data)
          .transition().duration(400)
          .attr("fill", d => {  
            return d >= 0
              ? "pink"
              : "skyblue"
          })
          .attr("x", d => {
            if(data.indexOf(dataMax) == 0) {
              return d >= 0 
                ? chart.graphWidth() / 2
                : chart.graphWidth() / 2 - (-d) * 10;
            }
            else {
              return d >= 0 
                ? chart.graphWidth() / 2  - d * 10
                : chart.graphWidth() / 2;
            }
          })
          .attr("y", (d, i) => i * 20)
          .attr("width", d => d >= 0 ? d*10 : -d*10)
          .attr("height", 20)
      }    
    },
  }
}
</script>

<style scoped>
#bar-chart-profit {
  padding-top: 10%;
}
</style>