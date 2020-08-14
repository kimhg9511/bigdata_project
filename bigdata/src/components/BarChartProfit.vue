<template>
  <div id="bar-chart-profit">
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
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
        bottom: 50,
        left: 120
      },
      domainX: [-30, 30],
      sorted: false,
    }
  },
  computed: {    
    month() {
      return this.$store.state.month;
    },
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
      barChart.append("line")
        .attr("x1", 0)
        .attr("x2", this.graphWidth)
        .attr("y1", this.graphHeight + 0.5)
        .attr("y2", this.graphHeight + 0.5)
        .style("stroke-width", 1)
        .style("stroke", "#e5e5e5")
      barChart.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(${this.graphWidth / 2},${this.graphHeight})`)
      const yAxisGroup = barChart.append("g")
        .classed("y-axis", true)  

        // .attr("y2",)

      this.oneDayData = this.data.filter(el => el[2] == "Jan-19");
      barChart.selectAll("rect")
        .data(this.oneDayData)
        .enter()
        .append("rect")
        .call(this.draw, this.oneDayData)  
    },
    draw(selection) {
      const xAxisGroup = d3.select(`${this.chartName} .x-axis`)
        .transition().duration(1200);
      const yAxisGroup = d3.select(`${this.chartName} .y-axis`);
      xAxisGroup.call(this.xAxis.tickSize(-this.graphHeight));
      yAxisGroup.transition().duration(1200).call(this.yAxis)
        .selectAll("text")
        .attr("transform", "rotate(-15)")
        .attr("font-size", "0.8rem")
      yAxisGroup.selectAll("text")
        .on("mouseover", function() {
          console.log(this.month);

          d3.select(this)
            .transition().duration(400)
            .attr("font-size", "1.4rem")
            .attr("color", "#ffeb3b")
            .attr("transform", "translate(20)rotate(0)")
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition().duration(400)
            .attr("font-size", "0.8rem")
            .attr("color", "#e5e5e5")
            .attr("transform", "translate(0)rotate(-15)")
        })
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
      newMonth = newMonth.replace(newMonth.split("-")[1], "19")
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
  opacity: 0;
}
#bar-chart-profit .x-axis .tick:first-of-type(1)>line{
  opacity: 0;
}
#bar-chart-profit .x-axis .tick:nth-of-type(7){
  font-style: italic;
  color: #E53935;
}
#bar-chart-profit .x-axis .tick:not(:nth-of-type(7))>line{
  color: #e5e5e5;
  stroke-dasharray: 10 3;
  opacity: 0.3;
}
</style>