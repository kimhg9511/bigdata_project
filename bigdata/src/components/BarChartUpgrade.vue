<template>
  <div id="bar-chart-profit-upgrade">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      chartName: "#bar-chart-profit-upgrade",
      data: this.$store.state.dataBarProfitUpgrade.slice(0,-1).map(el => el.slice(0,-1)),
      width: 800,
      height: 500,
      margin: {
        top: 80,
        right: 30,
        bottom: 50,
        left: 40
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
    month() {
      return this.$store.state.month;
    },
    company() {
      return this.data.map(el => el[0]);
    },
    profit() {
      return this.data.map(el => el[1]);
    },
    xScale() {
      return d3.scaleBand()
        .domain(this.company)
        .range([0,this.graphWidth])
    },
    yScale() {
      return d3.scaleLinear()
        .domain([-20,60])
        .range([this.graphHeight, 0])
    },
    yScaleUp() {
      return d3.scaleLinear()
        .domain([0,60])
        .range([0, this.graphHeight / 4 * 3])
    },
    yScaleDown() {
      return d3.scaleLinear()
        .domain([0,-20])
        .range([0, this.graphHeight / 4])
    },
    xAxis() {
      return d3.axisBottom(this.xScale);
    },
    yAxis() {
      return d3.axisLeft(this.yScale)
        .ticks(10)
        .tickFormat(d => d + " %");
    } 
  },
  mounted() {
    this.drawLineChart()
  },
  methods: {
    drawLineChart() {
      // 데이터 전처리
      const data = [];
      // 차트 설정
      const lineChart = this.setSVG(this.chartName);
      // scale 설정
      lineChart.append("g").classed("x-axis", true)  
        .attr("transform", `translate(0,${this.graphHeight})`)
      lineChart.append("g").classed("y-axis", true)  
      // init
      lineChart.selectAll("rect").data(this.data).enter().append("rect").call(this.drawBar);
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
    drawBar(selection) {
      console.log();
      const xAxisGroup = d3.select(`${this.chartName} .x-axis`)
        .transition().duration(1200);
      const yAxisGroup = d3.select(`${this.chartName} .y-axis`);
      xAxisGroup.call(this.xAxis);
      yAxisGroup.call(this.yAxis.tickSize(-this.graphWidth));
      selection
        .attr("x", d => this.xScale(d[0]) + this.xScale.bandwidth() / 4)
        .attr("y", d => d[1] >= 0 
          ? this.graphHeight - this.yScaleUp(d[1]) - this.yScale(40)
          : this.graphHeight - this.yScale(40))
        .attr("width", this.xScale.bandwidth() / 2)
        .attr("height", d => {
          console.log("Data:", d[1]);
          console.log("Scale:", this.yScale(d[1]));
          return d[1] >= 0 
            ? this.yScaleUp(d[1]) 
            : this.yScaleDown(d[1])
        })
        .attr("fill", (d,i) => d3.schemePastel1[i])
    }
  },
}
</script>

<style>
#bar-chart-profit-upgrade {
  padding-top: 30%;
}
#bar-chart-profit-upgrade .y-axis .domain {
  opacity: 0;
}
#bar-chart-profit-upgrade .y-axis .tick>line{
  color: #e5e5e5;
  stroke-dasharray: 10 3;
  opacity: 0.3;
}
#bar-chart-profit-upgrade .y-axis .tick:first-of-type>line {
  opacity: 0;
}
</style>