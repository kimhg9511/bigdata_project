<template>
  <div class="progress">
    <button id="play-button">Play</button>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  mounted() {
    this.drawProgress();
    this.test();
  },
  methods: {
    drawProgress() {
      const svgWidth = 960;
      const svgHeight = 500;

      const formatDateIntoYear = d3.timeFormat("%Y");
      const formatDate = d3.timeFormat("%b %Y");
      const parseDate = d3.timeParse("%m%d%y");
      
      const startDate = new Date("2004-11-01");
      const endDate = new Date("2017-04-01");

      const margin = {top:50, right:50, bottom:0, left:50}
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;

      const svg = d3.select(".progress")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

      // **************** slider **************** //
      let moving = false;
      let currentValue = 0;
      let targetValue = graphWidth;

      let playButton = d3.select("#play-button");

      const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);
      
      const slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", `translate(${margin.left},${graphHeight/5})`);
        
      slider.append("line")
        .attr("class", "track")
        .attr("x1", xScale.range()[0])
        .attr("x2", xScale.range()[1])
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
          .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
          .attr("class", "track-overlay")
        .call(d3.drag()
          .on("start.interrupt", function(){slider.interrupt();})
          .on("start drag", function(){
            currentValue = d3.event.x;
            update(xScale.invert(currentValue));
          })
        );

      slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", `translate(0,${18})`)
      .selectAll("text")
        .data(xScale(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) {return formatDateIntoYear(d); });

      let handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)

      let label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", `translate(0,${-25})`)
      
      let dataset;

      let plot = svg.append("g")
        .attr("class", "plot")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      dataset = data2;
      drawPlot(dataset);

      playButton.on("click", function() {
        let button = d3.select(this);
        if(button.text() == "Puase") {
          moving = false;
          clearInterval(timer);
          button.text("Play");
        }
        else {
          moving = true;
          timer = setInterval(step, 100);
          button.text("Pause");
        }
        console.log("Slider moving: " + moving);
      });
    },
    perpare(d) {
      d.id = d.id;
      d.date = parseDate(d.date);
      return d;
    },
    step() {
      update(xScale.invert(currentValue));
      currentValue = currentValue + (targetValue/151);
      if(currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        playButton.text("Play");
        console.log("Slider moving: " + moving);
      }
    },
    drawPlot(data) {
      let locations = plot.selectAll(".location")
        .data(data2);
      
      locations.enter()
        .append("circle")
        .attr("class", "location")
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", graphHeight/2)
        .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8); })
        .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7); })
        .style("opacity", 0.5)
        .attr("r", 8)
          .transition()
          .duration(400)
          .attr("r", 25)
            .transition()
            .attr("r", 8);

      location.exit()
        .remove();
    },
    update(h) {
      handle.attr("cx", xScale(h));
      label.attr("x", xScale(h))
        .text(formatDate(h));

      let newData = dataset.filter(function(d) {
        return d.date < h;
      })
      drawPlot(newData);
    },
    test() {
      console.log("d3.scaleTime", d3.scaleTime);
    }
  }
}
// https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763
</script>

<style scoped>
.user1 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
}
</style>