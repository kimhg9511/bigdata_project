<template>
  <div id="text-cloud">
  </div>
</template>
<script>
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import * as keywords from "../../public/data/rtop20_stocks20200707.json"
import { setWordCloud } from '../assets/drawChart';
export default {
  data() {
    return { 
      keywords : keywords.default,
      texts: '',
    }
  },
  mounted() {
    this.generateCloud(this.keywords, 'rectangular','monospace');
  },
  methods: {
    generateCloud(keywords, spiral, fontFamily){
      const chart = {
        width: 500,
        height: 300,
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        graphWidth() {
          return this.width - this.margin.left - this.margin.right;
        },
        graphHeight() { 
          return this.height - this.margin.top - this.margin.bottom;
        },
      };
      // 데이터셋
      const mainKeywords = Object.keys(keywords);
      let counts = mainKeywords.map(elem => keywords[elem]['count']);
      // plot 크기
      // 스케일 최대 최소 구하기
      let cMax = counts.reduce((a,b) => a > b ? a : b);
      let cMin = counts.reduce((a,b) => a > b ? b : a);
      // 글자 크기 스케일
      const fontSizeScale = d3.scalePow()
        .exponent(5)
        .domain([cMin, cMax])
        .range([20, 60]);
      const fontColorScale = d3.scaleLinear()
        .domain([cMin,cMax])
        .range(["rgba(24,117,209,0.4)", "rgb(24,117,209)"]);

      let svg = d3.select("#text-cloud")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
        .attr("x", chart.width)
        .attr("y", chart.height)
        .classed("svg-content", true)
        .append("g")
        .attr("transform",`translate(${chart.graphWidth()/2},${chart.graphHeight()/2})`);
      const data = Object.keys(keywords).map(function(d) { 
        return {text: d}; 
      });
      setLayout(data);  
      setInterval(function(){
        setLayout(data);
      },4000) 
      function setLayout(data) {
        cloud()
          .size([chart.graphWidth(), chart.graphHeight()])
          .words(data)
          .padding(2)
          .rotate(0)
          .text(d => d.text)
          .font(fontFamily)      
          .fontSize(d => fontSizeScale(keywords[d.text]['count']))
          .spiral(spiral)
          .on("end", draw)
          .start();
      }
      function draw(words) {
        let cloud = svg
          .selectAll("text")
          .data(words)

        cloud.enter().append("text")
          .text(d => d.text)
          .attr("text-anchor", "middle")
          .attr("class", "cloud-item")
          .style("fill", d => fontColorScale(d.size))
          .style("font-size", d => {
            return fontSizeScale(keywords[d.text]['count']);
          })
          .style("font-family", d => d.font)
          .on("click", (d) => {
            console.dir(d);
            d3.select("#content-box").dispatch("update", {detail: {data: d}})
          })
          .transition()
          .duration(800)
          .delay((d, i) => i * 20)
          .attr("transform", d => 
            `translate(${[d.x, d.y]})rotate(${d.rotate})`
          )
        cloud.exit().remove()
        cloud
          .transition()
          .duration(800)
          .delay((d, i) => i * 20)
          .attr("transform", d => 
            `translate(${[d.x, d.y]})rotate(${d.rotate})`
          )
      }
    },
    generateBox(text){
      this.texts = text
    },
  }
}
</script>

<style scoped>
#text-cloud {
  padding-top: 25%;
}
</style>