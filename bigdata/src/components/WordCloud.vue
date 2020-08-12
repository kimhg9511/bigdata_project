<template>
  <div id="text-cloud">
  </div>
</template>
<script>
import * as d3 from "d3";
import * as d3cloud from "d3-cloud";
export default {
  name: "word-cloud",
  data() {
    return { 
      data : this.$store.state.dataCloud,
      texts: '',
      width: 500,
      height: 300,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
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
    keywords() {
      return Object.keys(this.data);
    },
    wordCounts() {
      return this.keywords.map(elem => this.data[elem]['count']);
    },
    cMax() {
      return this.wordCounts.reduce((a,b) => a > b ? a : b);
    },
    cMin() {
      return this.wordCounts.reduce((a,b) => a > b ? b : a);
    }
  },
  mounted() {
    this.generateCloud();
  },
  methods: {
    generateCloud(){
      const setLayout = this.setLayout;
      // 글자 크기 스케일
      const scale = this.setScales(this.cMin, this.cMax);
      let svg = d3.select("#text-cloud")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .attr("x", this.width)
        .attr("y", this.height)
        .classed("svg-content", true)
        .append("g")
        .attr("transform",`translate(${this.graphWidth/2},${this.graphHeight/2})`);
      // const data = Object.keys(keywords).map(function(d) { 
      //   return {text: d}; 
      // });
      let data = [{'name':'','count':''}];
      for (let i=0;i<this.keywords.length;i++){
        data[i] = {
          "name": this.keywords[i],
          "count": this.wordCounts[i]
        }
      }
      svg.call(setLayout, data, scale);  
      setInterval(function(){
        svg.call(setLayout, data, scale);
      },4000) 
    },
    setScales(cMin, cMax) {
      const font = d3.scalePow()
        .exponent(5)
        .domain([cMin, cMax])
        .range([20, 60]);
      const color = d3.scaleLinear()
        .domain([cMin,cMax])
        .range(["rgba(24,117,209,0.4)", "rgb(24,117,209)"]);
      return {font, color}
    },
    setLayout(selection, data, scale) {
      const cloud = d3cloud()
        .size([this.graphWidth, this.graphHeight])
        .words(data)
        .padding(2)
        .rotate(0)
        .text(d => d.name)
        .font('monospace')      
        .fontSize(d => scale.font(d.count))
        .on("end", data => {
          this.draw(data, scale, selection)
        })
        .start();
    },
    draw(words, scale, selection) {
      const cloud = selection.selectAll("text").data(words);
      cloud.enter().append("text")
        .text(d => d.text)
        .attr("text-anchor", "middle")
        .attr("class", "cloud-item")
        .style("fill", d => scale.color(d.size))
        .style("font-size", d => d.size)
        .style("font-family", d => d.font)
        .on("click", (d) => {
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
  }
}
</script>

<style>
@font-face {
  font-family: "ksh";
  src: url("../fonts/KaushanScript-Regular.ttf");
}
#text-cloud {
  padding-top: 33%;
}
.test{
  font-family: "ksh";
}
</style>