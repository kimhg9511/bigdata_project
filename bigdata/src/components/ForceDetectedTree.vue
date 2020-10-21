<template>
  <div id="force-detected-tree"></div>
</template>

<script>
import * as d3 from "d3";
import * as json from "../../public/data/hot_coin.json";
export default {
  data() {
    return {
      colorScale_1: d3.schemePastel1
    };
  },
  mounted() {
    this.drawTreeChart();
  },
  methods: {
    drawTreeChart() {
      const width = 800;
      const height = 500;
      const target = {
        name: "코인",
        children: json.default.children.map(el => {
          return {
            name: el.name,
            children: el.children.sort((a, b) => b - a).filter((v, i) => i >= 50 && i < 80)
          };
        })
      };
      const root = d3.hierarchy(target);
      const links = root.links();
      const nodes = root.descendants();

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(d => {
              return d.target.data.value ? d.target.data.value * 0.2 + 25 : 100;
            })
            .strength(0.5)
        )
        .force("charge", d3.forceManyBody().strength(-90))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
      let svg = d3
        .select("#force-detected-tree")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content", true)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
      const link = svg
        .append("g")
        .attr("stroke", "rgba(229,229,229,0.2)")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 2);
      // () => {
      //   const temp = Math.random() * 3;
      //   return temp;
      // });
      const node = svg
        .append("g")
        .selectAll("g")
        .data(nodes)
        .join("g");
      node
        .append("circle")
        // .attr("fill", d => d.children ? null : "#ffeb3b")
        .attr("fill", "rgba(229,229,229,0.5)")
        // .attr("stroke", d => d.children ? null : "#000")
        .attr("r", d => {
          return (3 - d.depth) * 10;
        })
        // .attr("opacity", 0.5)
        .call(drag(simulation));
      node
        .append("text")
        .attr("fill", () => {
          return this.colorScale_1[
            parseInt(Math.random() * this.colorScale_1.length)
          ];
        })
        .style("font-size", d => (3 - d.depth) * 20)
        // d.children ? null : "#e5e5e5")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .call(drag(simulation));
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        node
          .selectAll("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
        node
          .selectAll("text")
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
      function drag(simulation) {
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
        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }
    }
  }
};
</script>

<style>
#force-detected-tree {
  padding-top: 60%;
}
</style>