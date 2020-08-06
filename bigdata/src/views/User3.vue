<template>
  <div class="user3">
    <div class="text-cloud">

    </div>
    <div class="information">
      {{ texts }}
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import * as keywords from "../../public/data/rtop20_stocks20200707.json"
import { setWordCloud } from '../assets/drawChart';
export default {
  name: 'app',
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
      console.log(keywords);
      // 데이터셋
      const mainKeywords = Object.keys(keywords);
      let counts = mainKeywords.map(elem => keywords[elem]['count']);
      // plot 크기
      let width = 500;
      let height = 300;
      let colors = ["#111","#333","#555","#777","#999"]
      // 스케일 최대 최소 구하기
      let cMax = counts.reduce((a,b) => a > b ? a : b);
      let cMin = counts.reduce((a,b) => a > b ? b : a);
      // 글자 크기 스케일
      const fontSizeScale = d3.scalePow()
        .exponent(5)
        .domain([cMin, cMax])
        .range([20, 80]);

      let svg = d3.select(".text-cloud").append("svg")
          .attr('width', width)
          .attr('height', height);
          
      const layout = setWordCloud(keywords, spiral, fontSizeScale,fontFamily, [width, height], draw);

      layout.start();
      const generateBox = this.generateBox;
      function draw(words) {
        let g = svg.append("g")
          .attr("transform",`translate(${layout.size()[0]/2},${layout.size()[1]/2})`)
          .selectAll("text")
          .data(words)
          .enter();
        const word = g.append("text")
          .text(d => d.text)
          .attr("text-anchor", "middle")
          .attr("class", "cloud-item")
          .style("fill", (d,i) => colors[i%colors.length])
          .style("font-size", d => {
            return fontSizeScale(keywords[d.text]['count']);
          })
          .style("font-family", d => d.font)
        word
          .on('click', d => {
            // generateBox(keywords[d.text]['count']);
            generateBox(d)
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
      this.texts = text
    },
  }
}
</script>

<style scoped>
.user3 {
  display: flex;
}
</style>