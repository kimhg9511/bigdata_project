<template>
  <div id="bar-chart-marcap">

  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      data: this.$store.state.dataBarMarcap,
    }
  },
  computed: {
    dates() {
      return Array.from(new Set(this.data.map(el => el.Date)))
    }
  },
  mounted() {
    this.drawBarChart()
  },
  methods: {
    drawBarChart() {
      let count = 0;
      let date = this.dates[count];
      let OneDayData = preProcess(this.data, date).slice(2);
      const chart = {
        width: 1500,
        height: 500,
        margin: {
          top: 20,
          right: 100,
          bottom: 40,
          left: 100
        },
        graphWidth() {
          return this.width - this.margin.left - this.margin.right;
        },
        graphHeight() { 
          return this.height - this.margin.top - this.margin.bottom;
        },
      };
    // svg 설정
      const svgBar = d3.select("#bar-chart-marcap")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
        .classed("svg-content", true)
      const barChart = svgBar.append("g")
        .attr("transform", `translate(${chart.margin.left},${chart.margin.top})`);
      const xValue = 'Marcap';
      const yValue = 'Name';
    // 색상 설정
      const colorScale = d3.schemePastel1
    // 그래프 축 설정 - x
      const xAxisGroup = barChart.append("g")
        .attr("transform", `translate(0,${chart.graphHeight()})`)
        .transition().duration(100);
      const xScaleBar = d3.scaleLinear();
      const xAxis = d3.axisBottom(xScaleBar)
        .ticks(4)
        .tickFormat(d => d + " 원");
    // 그래프 축 설정 - y
      const yAxisGroup = barChart.append("g")
        .classed("yAxis", true)
        .attr("fill", (d,i) => colorScale[i%colorScale.length])
        .style("font-weight", "bold")
        .style("font-size", "8px");
      const yScaleBar = d3.scaleBand();
      const yAxis = d3.axisLeft(yScaleBar);
    // 처음 그릴 때
      barChart.selectAll("rect").data(OneDayData).call(draw, OneDayData)
      barChart.on("update", () => {
        let date = d3.event.detail.date;
        OneDayData = preProcess(this.data, date).slice(2);
        if (this.dates.includes(date)) {
          barChart.selectAll("rect").data(OneDayData).call(update, OneDayData)
        }
      })
      function draw(selection, OneDayData) {
        // x축 그리기
        xScaleBar 
          .domain([0, d3.max(OneDayData, d => +d.Marcap)])
          .range([0, chart.graphWidth()]);
        xAxisGroup.call(xAxis);
        // y축 그리기
        yScaleBar
          .domain(OneDayData.map(OneDayData => OneDayData.Name))
          .range([0, chart.graphHeight()])
          .paddingInner(0.2)
          .paddingOuter(0.2);
        yAxisGroup.call(yAxis);
        // 막대 그리기
        const rects = selection
          .enter()
          .append("rect")      
          .attr("class", "bar-rect")
        rects
          .attr("fill", (d,i) => colorScale[i%colorScale.length])
          .attr("opacity", 0.8)
          .attr("x", 1)
          .attr("y", d =>{ 
            return yScaleBar(d[yValue])
          })
          .attr("height", yScaleBar.bandwidth)
          .transition()
          .duration(100)
          .delay((d,i) => i * 40)
          .attr("width", d=> xScaleBar(d[xValue]))  
          selection.data(OneDayData)
            .transition()
            .duration(100)
            .attr("width", d=> xScaleBar(d[xValue]))
            .attr("y", d => {
              return yScaleBar(d[yValue])
            })
          selection.on("click", (d,i) => {
            console.log(d);
          })
        selection.exit().remove();

        yAxisGroup.selectAll("g.tick>text")
          .attr("opacity", 0)
          .attr("font-size", 0)
          .transition()
          .duration(100)
          .delay((d, i) => i * 40)
          .attr("opacity", 1)
          .attr("font-size", 12)
      }
      function update(selection, OneDayData) {
        // xAxis update
        xScaleBar 
          .domain([0, d3.max(OneDayData, d => +d.Marcap)])
          .range([0, chart.graphWidth()]);
        xAxisGroup.call(xAxis);
        // yAxis update
        yScaleBar
          .domain(OneDayData.map(OneDayData => OneDayData.Name))
          .range([0, chart.graphHeight()]);
        yAxisGroup
          .transition()
          .duration(100)
          .call(yAxis);
        selection.data(OneDayData)
          .transition()
          .duration(100)
          .attr("width", d=> xScaleBar(d[xValue]))
          .attr("y", d => {
            return yScaleBar(d[yValue])
          })
        yAxisGroup.selectAll("g.tick>text")
          .attr("opacity", 0)
          .attr("font-size", 0)
          .attr("opacity", 1)
          .attr("font-size", 12)
      }
      function preProcess(data, date) {
        let temp_array = new Array();
        data.map( el =>{
          if(el['Date'] === date){
            temp_array.push(el)
          };
        });
        return temp_array
      }
    },
  }
}
</script>

<style scoped>
#bar-chart-marcap {
  padding-top: 34%;
}
</style>