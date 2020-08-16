<template>
  <div id="line-chart-profit-upgrade">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      chartName: "#line-chart-profit-upgrade",
      data: this.$store.state.dataLineProfitUpgrade.slice(0,-1),
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
    // month() {
    //   return this.$store.state.month;
    // },
    year() {
      return [2016, 2017, 2018];
    },
    xScale() {
      return d3.scaleBand()
        .domain(this.year)
        .range([0,this.graphWidth])
    },
    yScale() {
      return d3.scaleLinear()
        .domain([0,60])
        .range([this.graphHeight,0])
    },
    xAxis() {
      return d3.axisBottom(this.xScale);
    },
    yAxis() {
      return d3.axisLeft(this.yScale)
        .ticks(5)
        .tickFormat(d => d + " %");
    },
  },
  mounted() {
    this.drawLineChart()
  },
  methods: {
    drawLineChart() {
      console.log();
      // 데이터 전처리
      const data = [];
      // 차트 설정
      const lineChart = this.setSVG(this.chartName);
      // scale 설정
      lineChart.append("g").classed("x-axis", true)  
        .attr("transform", `translate(0,${this.graphHeight})`)
      lineChart.append("g").classed("y-axis", true)  
      // init
      for (let i in this.data) {
        lineChart.append("path").datum(this.data[i].slice(1))
          .call(this.drawLine, i);
        lineChart.append("circle").attr("cx",110*i).attr("cy",-40).attr("r", 6).style("fill", d3.schemePastel1[i])
        lineChart.append("text").attr("x", 110*i).attr("y", -40).text(this.data[i][0]).style("font-size", "18px").attr ("alignment-baseline","middle").attr("fill", "#e5e5e5").attr("transform", "translate(15,2)")
        .style("font-family", "NanumBarunpen").style("font-weight", 700)
      }
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
    drawLine(selection, idx) {
      const xAxisGroup = d3.select(`${this.chartName} .x-axis`);
      const yAxisGroup = d3.select(`${this.chartName} .y-axis`);
      xAxisGroup.call(this.xAxis);
      yAxisGroup
        .call(this.yAxis.tickSize(-this.graphWidth))
      const xScale = this.xScale;
      const ySclae = this.yScale;
      const line = d3.line()
        .x((d, i) => {
          return xScale(this.year[i])
        })
        .y(d => {
          return this.yScale(d)
        })
      selection
        .attr("fill", "none")
        .attr("stroke", d3.schemePastel1[idx])
        .attr("transform", `translate(${this.xScale.bandwidth()/2},0)`)
        .attr("stroke-width", 3)
        .attr('d', line)
      const pathLength = selection.node().getTotalLength();
      selection
        .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
        .attr('stroke-dashoffset', pathLength)
        .transition().duration(1200).ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
    },
  },

}
</script>

<style>
#line-chart-profit-upgrade {
  padding-top: 30%;
}
#line-chart-profit-upgrade .y-axis .domain {
  opacity: 0;
}

#line-chart-profit-upgrade .y-axis .tick>line{
  color: #e5e5e5;
  stroke-dasharray: 10 3;
  opacity: 0.3;
}
#line-chart-profit-upgrade .y-axis .tick:first-of-type>line {
  opacity: 0;
}
</style>