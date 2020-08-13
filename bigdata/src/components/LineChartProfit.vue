<template>
  <div id="line-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      chartName: "#line-chart-profit",
      data: this.$store.state.dataLineProfit,
      width: 800,
      height: 500,
      margin: {
        top: 80,
        right: 30,
        bottom: 30,
        left: 40
      },
      currentDate: '',
    }
  },
  computed: {
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
    date() {
      return this.data.map(el => el[0]);
    },
    profit() {
      return this.data.map(el => el[4]);
    },
    xScale() {
      return d3.scaleBand()
        .domain(this.date)
        .range([0,this.graphWidth])
    },
    yScale() {
      return d3.scaleLinear()
        .domain([-10,10])
        .range([this.graphHeight,0])
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
      this.date.map((el,idx) => {
        data[idx] = {
          date: el,
          profit: this.profit[idx]
        }
      })
      // 차트 설정
      const lineChart = this.setSVG(this.chartName);
      // scale 설정
      lineChart.append("g").classed("x-axis", true)  
        .attr("transform", `translate(0,${this.graphHeight})`)
        // .transition().duration(400);
      lineChart.append("g").classed("y-axis", true)  
      // init
      lineChart.append("path").datum(data)
        .call(this.drawLine);
      const circles = lineChart.selectAll("circle").data(data)
      circles.enter().append("circle")
        .call(this.drawCircle)
      setTimeout(() => {
        d3.select(`${this.chartName} circle`).dispatch("click")
      }, 1200);    
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
    drawLine(selection) {
      const xAxisGroup = d3.select(`${this.chartName} .x-axis`);
      const yAxisGroup = d3.select(`${this.chartName} .y-axis`);
      xAxisGroup.call(this.xAxis);
      yAxisGroup
        .call(this.yAxis.tickSize(-this.graphWidth))
      const xScale = this.xScale;
      const ySclae = this.yScale;
      const line = d3.line()
        .x(function(d) {return xScale(d.date)})
        .y(d => this.yScale(d.profit))
      selection
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("transform", `translate(${this.xScale.bandwidth()/2},0)`)
        .attr("stroke-width", 1.5)
        .attr('d', line)
      const pathLength = selection.node().getTotalLength();
      selection
        .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
        .attr('stroke-dashoffset', pathLength)
        .transition().duration(1200).ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
    },
    drawCircle(selection, data) {
      const self = this;
      selection
        .attr("cx", d => this.xScale(d.date))
        .attr("cy", d => this.yScale(d.profit))
        .attr("transform", `translate(${this.xScale.bandwidth()/2},0)`)
        .attr("fill", "rgba(0,0,0,0)")
        .attr("stroke", "orange")
        .attr("stroke-width", 1)
        .on("click", function(d) {
          self.currentDate = d.date;
          d3.select("circle.selected")
            .classed("selected", false)
            .attr("fill", "rgba(0,0,0,0)")
            .transition().duration(200).ease(d3.easeLinear)
            .attr("r", 10);
          d3.select(this)
            .classed("selected", true)
            .transition().duration(200).ease(d3.easeLinear)
            .attr("fill", "rgba(255,165,0,0.25)")
            .attr("r", 25)
            .transition().duration(200).ease(d3.easeLinear)
            .attr("fill", "rgba(255,165,0,0.5)")
            .attr("r", 15);
        })  
        .transition().duration(400).ease(d3.easeLinear)
        .attr("r", 15)
        .transition().duration(400).ease(d3.easeLinear)
        .attr("r", 10)
    },
  },
  watch: {
    'currentDate' (newvar, oldvar) {
      this.$emit('change', newvar)
    }
  }
}
</script>

<style scoped>
#line-chart-profit {
  width: 100%;
  padding-top: 40%;
}
.y-axis >>> .domain {
  opacity: 0;
}
.y-axis>.tick:nth-of-type(6){
  font-style: italic;
  color: red;
  /* opacity: ; */
}
.y-axis>.tick:not(:nth-of-type(6))>line{
  color: grey;
  opacity: 0.5;
}
.y-axis>.tick:first-of-type>line {
  opacity: 0;
}
</style>