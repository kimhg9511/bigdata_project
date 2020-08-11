<template>
  <div id="bar-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      data: this.$store.state.dataBarProfit,
      month: 0,
      oneDayData: [],
      width: 1000,
      height: 600,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 70
      },
      domainX: [-30,30],
    }
  },
  computed: {    
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
    dataDates() {
      return [...new Set(this.data.map(el => el[2]))];
    },
    xScale() {
      return d3.scaleLinear()
        .domain(this.domainX)
        .range([-this.graphWidth / 2,this.graphWidth / 2])
        .clamp(true)
    },
    xAxis() { 
      return d3.axisBottom(this.xScale);
    },
    domainY() {
      return this.oneDayData.map(el => el[0]);
    },
    yScale() {
      return d3.scaleBand()
        .domain(this.domainY)
        .range([0, this.graphHeight])
    },
    yAxis() {
      return d3.axisLeft(this.yScale);
    },
    redColorScale() {
      return d3.scaleLinear()
        .domain([0, 30])
        .range(["rgba(229,57,53,0.5)","#e53935"])
        .clamp(true)
    },
    blueColorScale() {
      return d3.scaleLinear()
        .domain([0, -30])
        .range(["rgba(30,136,229,0.5)","#1e88e5"])
        .clamp(true)
    }
  },
  mounted () {
    this.drawBarChart()
  },
  methods: {
    drawBarChart() {
      // 데이터 전처리
      // console.log(oneDayData)
      // console.log(Math.max(...this.oneDayData.map(el=>el[1])));
      this.oneDayData = this.data.filter(el => el[2] == this.dataDates[this.month]);
      // svg 그리기
      const svgBar = d3.select("#bar-chart-profit")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)
      const barChart = svgBar.append("g")
        .classed("bar-chart", true)
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`); 
      const xAxisGroup = barChart.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(${this.graphWidth / 2},${this.graphHeight})`);
      const yAxisGroup = barChart.append("g")
        .classed("y-axis", true)  
      barChart.selectAll("rect").data(this.oneDayData).enter().append("rect").call(this.draw, this.oneDayData)  
    },
    draw(selection, data) {
      const xAxisGroup = d3.select(".x-axis");
      const yAxisGroup = d3.select(".y-axis")
        .transition().duration(1200);
      xAxisGroup.call(this.xAxis);
      yAxisGroup.call(this.yAxis);
      // init
      selection
        .attr("y", d => this.yScale(d[0]))
        .attr("height", this.yScale.bandwidth())
        .on("click", () => {
          this.month += 1;
          this.oneDayData = this.data.filter(el => el[2] == this.dataDates[this.month]);
        })
        .transition().duration(1200).delay((d, i) => i*20)
        .attr("fill", d => {
          if (d[1] == "#VALUE!") {
            return "black"
          }
          else {
            console.log(d[1]);
            return d[1] >= 0
              ? this.redColorScale(d[1])
              : this.blueColorScale(d[1])
          }
        })
        .attr("x", d => {
          // 거래정지 종목 처리
          if (d[1] == "#VALUE!") {
            return this.graphWidth / 4
          }
          else {
            return d[1] >= 0 
              ? this.graphWidth / 2 
              : this.graphWidth / 2 + this.xScale(d[1])
          }
        })
        .attr("width", d => {
          // 거래정지 종목 처리
          if(d[1] == "#VALUE!") {
            return Math.abs(this.xScale(this.graphWidth))
            return 0
          }
          else {
            return Math.abs(this.xScale(d[1]));
          }
        })
    },
  },
  watch: {
    'oneDayData' (newData) {
      d3.select(".bar-chart").selectAll("rect").data(newData).call(this.draw, newData, this.xAxis, this.yAxis)
    }
  }
}
</script>

<style scoped>
#bar-chart-profit {
  padding-top: 100%;
}
</style>