<template>
  <div id="text-cloud">
  </div>
</template>
<script>
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import * as keywords from "../../public/data/rtop20_stocks20200707.json"
export default {
  name: 'app',
  data() {
    return { 
      keywords : keywords.default,
    }
  },
  mounted() {
    this.generateCloud(this.keywords, 'rectangular','monospace');
  },
  methods: {
    generateCloud(keywords, spiral, fontFamily){
      const mainKeywords = Object.keys(keywords);
      let counts = mainKeywords.map(elem => keywords[elem]['count']);
      let cMax = counts.reduce((a,b) => a > b ? a : b);
      let cMin = counts.reduce((a,b) => a > b ? b : a);
      const fontSizeScale = d3.scalePow()
        .exponent(5)
        .domain([cMin, cMax])
        .range([20, 80]);
      let width = 500;
      let height = 300;
      let colors = ["#111","#333","#555","#777","#999"]

      let svg = d3.select("#text-cloud").append("svg")
          .attr('width', width)
          .attr('height', height);
          
      let layout = cloud()
        .size([width, height])
        .words(mainKeywords.map(function(d) { return {text: d}; }))
        .padding(2)
        .rotate(5)
        .text(d => d.text)
        .font(fontFamily)      
        .fontSize(d => fontSizeScale(keywords[d.text]['count']))
        .spiral(spiral)
        .on("end", draw);

      layout.start();

      const generateBox = this.generateBox;
      function draw(words) {
        let g = svg.append("g")
          .attr("transform",`translate(${layout.size()[0]/2},${layout.size()[1]/2})`)
          .selectAll("text")
          .data(words)
          .enter();
        g.append("text")
          .text(d => d.text)
          .attr("text-anchor", "middle")
          .attr("class", "cloud-item")
          .style("fill", (d,i) => colors[i%colors.length])
          .style("font-size", d => {
            return fontSizeScale(keywords[d.text]['count']);
          })
          .style("font-family", d => d.font)
          .on('click', d => {
            generateBox(keywords[d.text]['count']);
            console.dir()
          })
          .transition()
          .duration(600)
          .delay((d, i) => i * 20)
          .attr("transform", d => 
            `translate(${[d.x, d.y]})rotate(${d.rotate})`
          )
      }
    },
    generateBox(text){
      console.log(text);
      console.dir(this)
    },
  }
}
</script>

<style scoped>
</style>