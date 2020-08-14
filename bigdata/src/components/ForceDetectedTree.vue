<template>
  <div id="force-detected-tree">

  </div>
</template>

<script>
import * as d3 from "d3";
import * as json from "../../public/data/flare-3.json"
export default {
  mounted() {
    this.drawTreeChart();
  },
  methods: {
    drawTreeChart() {
      
      const width = 800;
      const height = 500;
      // data definition
      const root = d3.hierarchy(json.default);
      const links = root.links();
      const nodes = root.descendants();

      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(50).strength(1))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("x", d3.forceX())
          .force("y", d3.forceY());
      // console.log(simulation);
      const svg = d3.select("#force-detected-tree").append("svg")
          .attr("viewBox", [-width / 2, -height / 2, width, height]);

      const link = svg.append("g")
        .attr("stroke", "grey")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", () => {
          const temp = Math.random() * 3;
          return temp;
        });
      const node = svg.append("g")
          .attr("fill", "#fff")
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
        .selectAll("g")
        .data(nodes)
        .join("g")
      node.append("circle")
        .attr("fill", d => d.children ? null : "#000")
        .attr("stroke", d => d.children ? null : "#fff")
        .attr("r", () => {
          const temp = (Math.random()+0.5) * 10
          return temp;
        })
        .attr("opacity", 0.7)
        .call(drag(simulation));
      node.append("text")
        // .style("color", d => d.children ? "#fff" : "#000")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .call(drag(simulation));
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.selectAll("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
        node.selectAll("text")
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
      function drag(simulation){
  
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      }
    }
  }
}
</script>

<style>
#force-detected-tree {
  width: 500px;
  height: 700px;
}
</style>