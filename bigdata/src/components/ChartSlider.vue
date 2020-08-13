<template>
  <div id="slider-wrap">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      chartName: '#slider-wrap',
      width: 1600,
      height: 300,
      margin: {
        top: 100,
        right: 50,
        bottom: 15,
        left: 50
      },
      currentValue: 0,
      currentIdx: 0,
      dataset: null,
      timer: null,
      startDate: new Date("2019-01-01 00:00:00"),
      endDate: new Date("2019-12-01 00:00:00"),
      formatD3ToMonth: d3.timeFormat("%b %Y"),
      formatD3ToDate: d3.timeFormat("%d %b"),
      parseDateToD3: d3.timeParse("%y-%m-%d"),
      formatD3ToTime: d3.timeFormat("%Y-%m-%d 00:00:00")
    }
  },
  computed: {
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3.scaleTime()
        .domain([this.startDate, this.endDate])
        .range([0, this.graphWidth])
        .clamp(true);
    },
  },
  mounted() {
    this.drawSlider();
  },
  methods: {
    drawSlider() {
      const self = this;
      // svg 생성
      const svg = d3.select(this.chartName)
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)      
      // playButton 지정
      const playButton = svg.append("g").call(this.drawButton);
      // slider 그리기
      const slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`)  
      slider.call(this.drawSliderBar);
      // 드래그 이벤트
      slider.call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          self.currentValue = self.xScale(self.xScale.invert(d3.event.x - self.margin.left));
        })
        // .on("end", function() {
        //   // let date = formatD3ToTime(xScale.invert(currentValue));
        //   // d3.selectAll("#bar-chart-marcap>svg>g").dispatch("update",{detail: {date}});
        // })
      );
      playButton.call(this.addProgressEvent, this.step);
    },
    drawButton(selection) {
      const button = selection.append("g")
        .attr("class", "play-button")
      button
        .append("rect")
        .attr("width", "100")
        .attr("height", "30")
        .attr("x", "45%")
        .attr("y", "70%")
        .attr("fill", "skyblue")
      button
        .append("text")
        .attr("x", "50%")
        .attr("y", "90%")
        .attr("text-anchor","middle")
        .attr("fill", "white")
        .style("font-weight", "bold")
        .text("Play")
    },
    drawSliderBar(selection) {
      selection.append("line")
        .attr("x1", this.xScale.range()[0])
        .attr("x2", this.xScale.range()[1])
        .attr("class", "track")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
        .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
      selection.selectAll("text")
        .data(this.xScale.ticks(12))
        .enter()
        .append("text")
        .attr("class", "domain")
        .attr("x", d => this.xScale(d))
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => this.formatD3ToMonth(d));
      selection.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
      selection.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(this.formatD3ToDate(this.startDate))
        .attr("transform", `translate(0,${-25})`)
    },
    addProgressEvent(selection, step) {
      let timer;
      const self = this;
      selection.on("click", function() {
        const button = d3.select(this).select("text");
        if(button.text() == "Pause") {
          clearInterval(timer);            
          button.text("Play");
        }
        else {
          timer = setInterval(() => {
            self.step(selection)
          }, 400);
          button.text("Pause");
        }
      })
      return selection;
    },
    step(selection) {
      this.currentIdx += 1;
      this.currentValue = this.xScale(this.xScale.ticks(12)[this.currentIdx]);
      if(this.currentIdx > 12) {
        this.currentIdx = 0;
        this.currentValue = 0;
        selection.dispatch("click");
      }
    }
  },
  watch: {
    'currentValue' (newValue, oldValue) {
      const ticks = this.xScale.ticks(12)
      this.currentIdx = ticks.map(el => this.xScale(el) <= newValue).indexOf(false)-1;
      if(d3.select(`${this.chartName} .play-button>text`).node().textContent == "Pause") {
        d3.select(`${this.chartName} .handle`)
          .transition().duration(400)
          .attr("cx", newValue);
        d3.select(`${this.chartName} .label`)
          .transition().duration(400)
          .attr("x", newValue)
          .text(this.formatD3ToDate(this.xScale.invert(newValue)));
      }
      else {
        d3.select(`${this.chartName} .handle`)
          .attr("cx", newValue);
        d3.select(`${this.chartName} .label`)
          .attr("x", newValue)
          .text(this.formatD3ToDate(this.xScale.invert(newValue)));
      }
    }
  }
}
</script>

<style>
#slider-wrap {
  position: relative;
  padding-top: 15%;
}
/* progress bar 트랙 설정 */
#slider-wrap .ticks {
  font-size: 10px;
}
#slider-wrap .track,
#slider-wrap .track-inset,
#slider-wrap .track-overlay {
  stroke-linecap: round;
}
#slider-wrap .track {
  stroke: #000;
  stroke-opacity: 0.3;
  stroke-width: 10px;
}
#slider-wrap .track-inset {
  stroke: #e5e5e5;
  stroke-width: 8px;
}
#slider-wrap .track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  stroke: transparent;
  cursor: crosshair;
}
#slider-wrap .domain {
  fill: #e5e5e5;
}
#slider-wrap .handle {
  fill: #e5e5e5;
  stroke: #e5e5e5;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;
}
#slider-wrap .label {
  fill: #e5e5e5;
}
</style>