<template>
  <div id="line-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      data: this.$store.state.dataLineProfit,
      width: 1200,
      height: 500,
      margin: {
        top: 20,
        right: 80,
        bottom: 60,
        left: 80
      },
    }
  },
  computed: {
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
  },
  mounted() {
    this.drawLineChart()
  },
  methods: {
    drawLineChart() {
      // 데이터 전처리
      const data = [];
      const base = this.data.slice(1,-1);
      const date = base.map(el => el[0]);
      const profit = base.map(el => el[el.length-1]);
      date.map((el,idx) => {
        data[idx] = {
          date: el,
          profit: profit[idx]
        }
      })
      // 차트 설정
      const lineChart = this.setSVG("#line-chart-profit");
      // scale 설정
      const xAxisGroup = lineChart.append("g")
        .attr("transform", `translate(0,${this.graphHeight})`)
        // .transition().duration(400);
      const yAxisGroup = lineChart.append("g")  
      const xScale = d3.scaleBand()//;
        .domain(date)
        .range([0,this.graphWidth])
      const yScale = d3.scaleLinear()//;
        .domain([-10,10])
        .range([this.graphHeight,0])
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale)
        .ticks(10)
        .tickFormat(d => d + " %");
      xAxisGroup.call(xAxis);
      // yAxisGroup.call(yAxis);
      yAxisGroup
        .classed("y-grid", true)
        // .attr("class", "y-grid")
        .call(yAxis.tickSize(-this.graphWidth))
      // init
      lineChart
        .call(this.drawLine, data, {xScale, yScale})
      lineChart
        .call(this.drawCircle, data, {xScale, yScale})  
    },
    setSVG(selector) {
      const svg = d3.select(selector)
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)
      const chart = svg.append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
      return chart;
    },
    setScale() {
    },
    drawLine(selection, data, scale) {
      console.log("draw called...");
      selection//.enter()
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("transform", `translate(${scale.xScale.bandwidth()/2},0)`)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) {return scale.xScale(d.date)})
          .y(d => scale.yScale(d.profit))
        );
    },
    drawCircle(selection, data, scale) {
      const circle = selection.selectAll("circle").data(data)
      circle.enter().append("circle")
        .attr("cx", d => scale.xScale(d.date))
        .attr("cy", d => scale.yScale(d.profit))
        .attr("r", 3)
        .attr("transform", `translate(${scale.xScale.bandwidth()/2},0)`)
        .attr("fill", "orange")
    }
  }
}
</script>

<style>
#line-chart-profit {
  width: 100%;
  padding-top: 40%;
}
.y-grid .domain {
  opacity: 0;
}
.y-grid>.tick:nth-of-type(6)>line{
  color: red;
  opacity: 0.3;
}
.y-grid>.tick:not(:nth-of-type(6))>line{
  color: grey;
  opacity: 0.5;
}
.y-grid>.tick:first-of-type>line {
  opacity: 0;
}
</style>