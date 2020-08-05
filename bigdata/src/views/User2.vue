<template>
  <div class="bar-chart">
  </div>
</template>

<script>
import * as d3 from "d3";
import {drawSVG, setAxis, drawPlot} from "../assets/drawChart.js"

export default {
  mounted() {
    this.generateSVG();
  },
  methods: {
    generateSVG() {
      const svgWidth = 600;
      const svgHeight = 600;
      // margin 설정
      const margin = { top: 20, right: 20, bottom: 80, left: 80 };
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
      // svg 생성
      const svg = d3.select(".bar-chart");

      const graph = this.drawSVG(svg, svgWidth, svgHeight, margin);
      // 데이터 로드
      d3.json('/data/menu.json').then(item => {
        // scale 설정
        const xScale = d3.scaleLinear()
          .domain([0, d3.max(item, d => d.orders)])
          .range([0, graphHeight]);
        const yScale = d3.scaleBand()
          .domain(item.map(item => item.name))
          .range([500, 0])
          .paddingInner(0.2)
          .paddingOuter(0.2);
        
        // axis 생성
        this.setAxis(graph, graphHeight, xScale, yScale)
        // 차트 생성
        this.drawPlot(graph, item, xScale, yScale)
      });        
    },
    drawSVG,
    setAxis,
    drawPlot
  }
}
</script>

<style scoped>
</style>