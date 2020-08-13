<template>
  <div id="bar-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: [
    "month"
  ],
  data() {
    return {
      chartName: '#bar-chart-profit',
      data: this.$store.state.dataBarProfit,
      oneDayData: [],
      oldData: [],
      width: 800,
      height: 500,
      margin: {
        top: 80,
        right: 50,
        bottom: 30,
        left: 120
      },
      domainX: [-30, 30],
      sorted: false,
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
    dataProfit() {
      return this.oneDayData.map(el => el[1] == "#VALUE!"
        ? 0
        : el[1]);
    },
    profitMax() {
      return Math.max(...this.dataProfit)
    },
    profitMin() {
      return Math.min(...this.dataProfit)
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
        .domain([0, this.profitMax])
        .range(["rgba(229,57,53,0.5)","#e53935"])
        .clamp(true)
    },
    blueColorScale() {
      return d3.scaleLinear()
        .domain([0, this.profitMin])
        .range(["rgba(30,136,229,0.5)","#1e88e5"])
        .clamp(true)
    },
  },
  mounted () {
    this.drawBarChart()
  },
  methods: {
    drawBarChart() {
      // svg 그리기
      const svgBar = d3.select(this.chartName)
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)
      const barChart = svgBar.append("g")
        .classed("bar-chart", true)
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`); 
      barChart.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(${this.graphWidth / 2},${this.graphHeight})`)
        .style("font-size", "20px");
      barChart.append("g")
        .classed("y-axis", true)  
        .style("font-weight", "bold")
        .style("font-size", "12px");
      this.oneDayData = this.data.filter(el => el[2] == "Jan-19");
      barChart.selectAll("rect")
        .data(this.oneDayData)
        .enter()
        .append("rect")
        .call(this.draw, this.oneDayData)  
    },
    draw(selection) {
      const xAxisGroup = d3.select(`${this.chartName} .x-axis`)
        .transition().duration(1200)
      const yAxisGroup = d3.select(`${this.chartName} .y-axis`)
        .transition().duration(1200);
      xAxisGroup.call(this.xAxis.tickSize(-this.graphHeight));
      yAxisGroup.call(this.yAxis);
      selection
        .attr("y", d => this.yScale(d[0]))
        .attr("height", this.yScale.bandwidth())
        // sort - 수익률순, 시총순
        .on("click", () => {
          if(this.sorted) {
            this.oneDayData = this.data.filter(el => el[2] == this.month);
          } else {
            let sortedData = [...this.oneDayData];
            this.oneDayData = sortedData.sort((a,b)=> b[1] - a[1]);
          }
          this.sorted = !this.sorted;
        })
        .attr("x", (d,i) => this.oldData.length == 0
            ? this.graphWidth / 2
            : this.oldData[i][1] >= 0 
            ? this.graphWidth / 2 
            : this.graphWidth / 2 + this.xScale(this.oldData[i][1]))
        .attr("width", (d,i) => this.oldData.length == 0
          ? 0
          : Math.abs(this.xScale(this.oldData[i][1])))
        .transition().duration(1200).delay((d, i) => i*20)
        .attr("fill", d => d[1] >= 0
          ? this.redColorScale(d[1])
          : this.blueColorScale(d[1]))
        .attr("x", d => d[1] >= 0 
          ? this.graphWidth / 2 
          : this.graphWidth / 2 + this.xScale(d[1]))
        .attr("width", d => Math.abs(this.xScale(d[1])))
    }
  },
  watch: {
    'oneDayData' (newData, oldData) {
      this.oldData = oldData;
      if(oldData != "") {
        d3.select(".bar-chart").selectAll("rect").data(newData).call(this.draw, newData, this.xAxis, this.yAxis)
      } 
    },
    'month' (newMonth, oldMonth){
      if(oldMonth != "") {
        let data = this.data.filter(el => el[2] == newMonth);
        if(this.sorted) data.sort((a,b)=> b[1] - a[1]);
        this.oneDayData = data;
      }
    }
  }
}
</script>

<style>
#bar-chart-profit {
  padding-top: 30%;
  display: flex;
  align-items: center;
}
#bar-chart-profit .x-axis .domain {
  stroke-width: 1;
  color: black;
}
#bar-chart-profit .x-axis .tick:nth-of-type(1)>line{
  opacity: 0;
}
</style>