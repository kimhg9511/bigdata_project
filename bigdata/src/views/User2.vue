<template>
  <div class="bar-chart">
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      data: [
        {
          "name": "veg soup",
          "orders": 200
        },
        {
          "name": "veg curry",
          "orders": 600
        },
        {
          "name": "veg pasta",
          "orders": 300
        },
        {
          "name": "veg surprise",
          "orders": 900
        },
        {
          "name": "veg burger",
          "orders": 1500
        }
      ]
    }
  },
  mounted() {
    this.generateSVG()
  },
  methods: {
    generateSVG() {
      const svgWidth = 600;
      const svgHeight = 600;
      // svg 생성
      const svg = d3.select(".bar-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // margin 설정
      const margin = { top: 20, right: 20, bottom: 100, left: 100 };
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
      const graph = svg
        .append("g")
        .attr("width", graphWidth)
        .attr("hegiht", graphHeight)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      // x축,y축 설정
      const xAxisGroup = graph.append("g")
        .attr("transform", `translate(0,${graphHeight})`);
      const yAxisGroup = graph.append("g");

      const data = this.data
      // d3.json(`${require('@/data/menu.json')}`).then(data => {
      const rects = graph.selectAll("rect").data(data);
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.orders)])
        .range([graphHeight, 0]);
      
      // const min = d3.min(data, d => d.orders);
      // const max = d3.max(data, d => d.orders);
      // const extent = d3.extent(data, d => d.orders);

      const xScale = d3.scaleBand()
        .domain(data.map(item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);
      
      rects
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(d.orders))
        .attr("fill", "orange")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.orders));

      rects
        .enter()
        .append("rect")      
        .attr("width", xScale.bandwidth)
        .attr("height", d => graphHeight - yScale(d.orders))
        .attr("fill", "orange")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.orders));

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale)
        .ticks(3)
        .tickFormat(d => d + " orders");

      xAxisGroup.call(xAxis);
      yAxisGroup.call(yAxis);
      
      xAxisGroup.selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("fill", "orange");
      // });
    }
  }
}
</script>

<style scoped>
</style>