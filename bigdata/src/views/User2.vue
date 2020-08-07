<template>
  <div class="user2">
    <svg class="bar-chart-profit"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      data: [
        3,
        -2,
        -1,
        6,
        -16,
        4,
        9,
        -4.5
      ]
    }
  },
  mounted() {
    this.drawBarChart()
  },
  methods: {
    drawBarChart() {
      const chart = {
        width: 500,
        height: 500,
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        graphWidth() {
          return this.width - this.margin.left - this.margin.right;
        },
        grapthHeight() { 
          return this.height - this.margin.top - this.margin.bottom;
        },
      };
      // svg(wrap)
      let data = this.data.sort((a,b)=> b-a)
      const svgBar = d3.select(".bar-chart-profit")
        .attr("width", chart.width)
        .attr("height", chart.height);
      // g(real chart)
      const barChart = svgBar.append("g")
        .attr("transform", `translate(${chart.margin.top},${chart.margin.left})`);
      let rects = barChart.selectAll("rect")
      rects.call(draw, data)
      // rect(bar)  
      function draw(rects, item) {
        rects.data(item);
        // rects.exit().remove();
        // rects
        //   .append("rect")
        //   .attr("fill", d => {  
        //     return d >= 0
        //       ? "pink"
        //       : "skyblue"
        //   })
        //   .attr("x", d => {
        //     return d >= 0 
        //       ? chart.graphWidth() / 2 
        //       : chart.graphWidth() / 2 - (-d) * 10
        //   })
        //   .attr("y", (d, i) => i * 20)
        //   .attr("width", d => d >= 0 ? d*10 : -d*10)
        //   .attr("height", 20)
        //   .on("click", d =>{
        //     rects = draw(item.reverse())
        //   });
        rects.enter()
          .append("rect")
          .attr("fill", d => {  
            return d >= 0
              ? "pink"
              : "skyblue"
          })
          .attr("x", d => {
            return d >= 0 
              ? chart.graphWidth() / 2 
              : chart.graphWidth() / 2 - (-d) * 10
          })
          .attr("y", (d, i) => i * 20)
          .attr("width", d => d >= 0 ? d*10 : -d*10)
          .attr("height", 20)
          .on("click", d =>{
            rects = draw(item.reverse())
          });
        // rects
        //   .append("rect")
        //   .attr("fill", d => {  
        //     return d >= 0
        //       ? "pink"
        //       : "skyblue"
        //   })
        //   .attr("x", d => {
        //     return d >= 0 
        //       ? chart.graphWidth() / 2 
        //       : chart.graphWidth() / 2 - (-d) * 10
        //   })
        //   .attr("y", (d, i) => i * 20)
        //   .attr("width", d => d >= 0 ? d*10 : -d*10)
        //   .attr("height", 20)
        //   .on("click", d =>{
        //     rects = draw(data.reverse())
        //   });
      }    
      
      // function toggle(data, rects, toggled) {
      //   console.log(data);
      //   console.log(rects);
      //   console.log(toggled);
      //   let rects2 = barChart.selectAll("rect")
      //   rects2.data(data);
      //   rects2.exit().remove();
      //   rects2.enter().append("rect")
      //   rects2.transition().duration(400)
      //     .attr("fill", d => {
      //         return d >= 0
      //           ? "pink"
      //           : "skyblue"
      //       })
      //     .attr("x", d => {
      //       return d >= 0 
      //         ? chart.graphWidth() / 2 
      //         : chart.graphWidth() / 2 - (-d) * 10
      //     })
      //     .attr("width", d => d >= 0 ? d*10 : -d*10)
      //     .attr("y", (d, i) => toggled ? i * 20 : (7-i) * 20)
      //   rects.datum({
      //     data,
      //     rects,
      //     toggled,
      //   })
      // }
    },
  }
}
</script>

<style scoped>
.user2{
  display: flex;
  flex-direction: column;
}
.test1 {
  background-color: #aaa;
  width: 50%;
}
.test2 {
  background-color: #999;
  width: 50%;
}
</style>