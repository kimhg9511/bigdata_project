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
      texts: '',
      width: 1000,
      height: 500,
      margin: {
        top: 0,
        right: 20,
        bottom: 50,
        left: 20
      },
      colorScale_1: d3.schemePastel1,
    }
  },
  computed: {
    realData() {      
      return this.rawData.sort((a,b) => b["count"] - a["count"]).slice(0,500)
    },
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
    cMax() {
      return this.realData.reduce((a,b) => a["count"] > b["count"] ? a : b)["count"];
    },
    cMin() {
      return this.realData.reduce((a,b) => a["count"] > b["count"] ? b : a)["count"];
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
        .range([-15,15]);
    }
  },
  mounted() {
    this.generateCloud();
  },
  methods: {
    generateCloud(){
      this.realData
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
      const test = this.realData;
      svg.call(this.setLayout, test);  
    },
    setLayout(selection, data) {
      const cloud = d3cloud()
        .size([this.graphWidth, this.graphHeight])
        .words(data)
        .padding(0.2)
        .rotate(() => {
          const temp = Math.random();
          return this.rotate(temp);
        })
        .text(d => d.name)
        .font('monospace')      
        .fontSize(d => this.font(d.count))
        .on("end", data => {
          this.draw(data, selection)
        })
        .start();
    },
    // updateLayout(selection, data) {
    //   const cloud = d3cloud()
    //     .size([this.graphWidth, this.graphHeight])
    //     .words(data)
    //     .padding(0.2)
    //     .rotate(() => {
    //       const temp = Math.random();
    //       console.log(temp);
    //       return this.rotate(temp);
    //     })
    //     .text(d => d.name)
    //     .font('monospace')      
    //     .fontSize(d => this.font(d.count))
    //     .on("end", data => {
    //       this.update(data, selection)
    //     })
    //     .start();
    // },
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
        // .on("click", (d) => {
        //   d3.select("#content-box").dispatch("update", {detail: {data: d}})
        // })
        .transition()
        .duration(400)
        .delay((d, i) => i * 2)
        .attr("transform", d => 
          `translate(${[d.x, d.y]})rotate(${d.rotate})`
        )
    },
    // update(words, selection) {
    //   const cloud = selection.selectAll("text").data(words);
    //   cloud
    //     .transition()
    //     .duration(400)
    //     // .delay((d, i) => i * 2)
    //     .attr("transform", d => 
    //       `translate(${[d.x, d.y]})rotate(${d.rotate})`
    //     )
    // }
  }
}
</script>

<style>
@font-face {
  font-family: "ksh";
  src: url("../fonts/KaushanScript-Regular.ttf");
}
#text-cloud {
  padding-top: 40%;
}
#text-cloud > svg{
  background-color: #333;
}
.test{
  font-family: "ksh";
}
</style>