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
      rawData : this.$store.state.dataCloud,
      width: 800,
      height: 500,
      colorScale_1: d3.schemePastel1,
    }
  },
  computed: {
    realData() {      
      return this.rawData.sort((a,b) => b["count"] - a["count"]).slice(0, 500)
    },
    cMin() {
      return this.realData.reduce((a,b) => a["count"] > b["count"] ? b : a)["count"];
    },
    cMax() {
      return this.realData.reduce((a,b) => a["count"] > b["count"] ? a : b)["count"];
    },
    font() {
      return d3.scalePow()
        .exponent(0.5)
        .domain([this.cMin, this.cMax])
        .range([8, 40]);
    },
    color() {
      return d3.scaleLinear()
        .domain([this.cMin,this.cMax])
        .range(["rgba(24,117,209,0.4)", "rgb(24,117,209)"]);
    },
    rotate() {
      return d3.scaleLinear()
        .domain([0,1])
        .range([-30,30]);
    }
  },
  mounted() {
    this.generateCloud();
  },
  methods: {
    generateCloud(){
      let svg = d3.select("#text-cloud")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)
        .append("g")
        .attr("transform",`translate(${this.width/2},${this.height/2})`); 
      svg.call(this.setLayout, this.realData);  
    },
    setLayout(selection, data) {
      const cloud = d3cloud()
        .size([this.width, this.height])
        .words(data)
        .padding(0.2)
        .rotate(() => {
          const temp = Math.random();
          return this.rotate(temp);
        })
        .text(d => d.name)
        .font('NanumSquareRound')      
        .fontSize(d => this.font(d.count))
        .on("end", data => {
          this.draw(data, selection)
        })
        .start();
    },
    draw(words, selection) {
      const cloud = selection.selectAll("text").data(words);
      cloud.enter().append("text")
        .text(d => d.text)
        .attr("text-anchor", "middle")
        .attr("class", "cloud-item")
        .attr("fill", d => this.colorScale_1[parseInt(Math.random() * this.colorScale_1.length)]
        )
        .style("font-size", d => d.size)
        .style("font-family", d => d.font)
        .style("font-weight", "900")
        // .on("click", (d) => {
        //   d3.select("#content-box").dispatch("update", {detail: {data: d}})
        // })
        .transition()
        .duration(400)
        .delay((d, i) => i * 2)
        .attr("transform", d => 
          `translate(${[d.x, d.y]})rotate(${d.rotate})`
        )
    }
  }
}
</script>

<style>
#text-cloud {
  padding-top: 60%;
}
#text-cloud > svg{
  background-color: #333;
}
.test{
  font-family: "ksh";
}
</style>